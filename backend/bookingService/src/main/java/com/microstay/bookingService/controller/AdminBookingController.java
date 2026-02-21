package com.microstay.bookingService.controller;

import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.service.AdminBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    // List bookings
    @GetMapping
    public List<Booking> listBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String hotelId) {

        return adminBookingService.listBookings(status, hotelId);
    }

    // Booking details
    @GetMapping("/{id}")
    public Booking getBooking(@PathVariable String id) {
        return adminBookingService.getBooking(id);
    }

    // Admin cancel booking
    @PutMapping("/{id}/cancel")
    public Booking adminCancel(@PathVariable String id) {
        return adminBookingService.adminCancel(id);
    }
}