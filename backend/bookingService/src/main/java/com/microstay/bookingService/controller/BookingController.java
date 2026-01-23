package com.microstay.bookingService.controller;

import com.microstay.bookingService.dto.BookingResponse;
import com.microstay.bookingService.dto.InitiateBookingRequest;
import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
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
    public ResponseEntity<Void> cancelBooking(@PathVariable String ref) {
        bookingService.cancelBooking(ref);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{ref}")
    public ResponseEntity<Booking> getBooking(@PathVariable String ref) {
        return ResponseEntity.ok(
                bookingService.getBooking(ref));
    }
}

