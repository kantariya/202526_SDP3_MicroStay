package com.microstay.bookingService.controller;

import com.microstay.bookingService.dto.BookingPaymentInfoResponse;
import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.entity.BookingStatus;
import com.microstay.bookingService.repository.BookingRepository;
import com.microstay.bookingService.service.InternalBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

/**
 * Internal endpoints used by other microservices (e.g., paymentService).
 * Not intended to be exposed via API Gateway.
 */
@RestController
@RequestMapping("/internal/bookings")
@RequiredArgsConstructor
public class InternalBookingController {

        private final BookingRepository bookingRepository;
        private final InternalBookingService internalBookingService;

        @GetMapping("/{bookingId}")
        public ResponseEntity<BookingPaymentInfoResponse> getBookingForPayment(
                        @PathVariable Long bookingId) {
                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

                return ResponseEntity.ok(
                                BookingPaymentInfoResponse.builder()
                                                .bookingId(booking.getBookingId())
                                                .bookingReference(booking.getBookingReference())
                                                .userId(booking.getUserId())
                                                .status(booking.getStatus())
                                                .totalAmount(booking.getTotalAmount())
                                                .currency(booking.getCurrency())
                                                .build());
        }

        @PostMapping("/{bookingId}/confirm")
        public ResponseEntity<Void> confirmBookingAfterPayment(
                        @PathVariable Long bookingId) {
                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

                if (booking.getStatus().equals(BookingStatus.CANCELLED)) {
                        throw new ResponseStatusException(BAD_REQUEST, "Cannot confirm a cancelled booking");
                }

                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setUpdatedAt(LocalDateTime.now());
                bookingRepository.save(booking);

                return ResponseEntity.ok().build();
        }

        @GetMapping("/eligible-for-review/{hotelId}")
        public ResponseEntity<?> checkEligibility(
                @RequestHeader("X-User-Id") String userId,
                @PathVariable String hotelId
        ) {
                boolean eligible = internalBookingService.isEligibleForReview(userId, hotelId);
                return ResponseEntity.ok(Map.of("eligible", eligible));
        }
}
