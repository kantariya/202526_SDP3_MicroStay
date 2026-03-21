package com.microstay.bookingService.controller;

import com.microstay.bookingService.dto.BookingResponse;
import com.microstay.bookingService.dto.InitiateBookingRequest;
import com.microstay.bookingService.dto.UserBookingsResponse;
import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/initiate")
    public ResponseEntity<BookingResponse> initiateBooking(
            @Valid @RequestBody InitiateBookingRequest request,
            @RequestHeader("X-User-Id") String userId) {

        return ResponseEntity.ok(
                bookingService.initiateBooking(request, userId));
    }

    @PostMapping("/{ref}/confirm")
    public ResponseEntity<Void> confirmBooking(@PathVariable String ref) {
        bookingService.confirmBooking(ref);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{ref}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable String ref,@RequestHeader("X-User-Id") String userId,@RequestHeader("X-User-Role") String userRole) {
        bookingService.cancelBooking(ref,userId,userRole);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{ref}")
    public ResponseEntity<Booking> getBooking(@PathVariable String ref) {
        return ResponseEntity.ok(
                bookingService.getBooking(ref));
    }

    @PostMapping("/{bookingId}/release-after-payment-failure")
    public void releaseAfterPaymentFailure(@PathVariable Long bookingId) {
        bookingService.releaseAfterPaymentFailure(bookingId);
    }

    @PostMapping("/{bookingId}/mark-payment-success")
    public void markPaymentSuccess(@PathVariable Long bookingId) {
        bookingService.markPaymentSuccess(bookingId);
    }

    @GetMapping("/my")
    public ResponseEntity<UserBookingsResponse> myBookings(
            @RequestHeader("X-User-Id") String userId) {
        // Enforced ownership by Design: userId comes from trusted header
        return ResponseEntity.ok(
                bookingService.getBookingsForUser(userId));
    }

    @GetMapping("/manager")
    public ResponseEntity<List<Booking>> managerBookings(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(bookingService.getBookingsForManager(userId));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Booking>> adminBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String hotelId) {
        return ResponseEntity.ok(bookingService.getAllBookings(status, hotelId));
    }

}
