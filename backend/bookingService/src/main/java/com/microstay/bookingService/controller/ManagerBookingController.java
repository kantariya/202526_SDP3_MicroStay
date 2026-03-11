package com.microstay.bookingService.controller;

import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.service.ManagerBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager/bookings")
@RequiredArgsConstructor
public class ManagerBookingController {

    private final ManagerBookingService managerBookingService;

    @GetMapping("/today-count")
    public long todayCount(@RequestParam List<String> hotelIds) {
        return managerBookingService.todayCount(hotelIds);
    }

    @GetMapping
    public List<Booking> list(@RequestParam List<String> hotelIds) {
        return managerBookingService.list(hotelIds);
    }

    // booking detail
    @GetMapping("/{id}")
    public Booking getOne(@PathVariable Long id) {
        return managerBookingService.getOne(id);
    }

    // check-in
    @PutMapping("/{id}/checkin")
    public Booking checkin(@PathVariable Long id) {
        return managerBookingService.checkin(id);
    }

    // check-out
    @PutMapping("/{id}/checkout")
    public Booking checkout(@PathVariable Long id) {
        return managerBookingService.checkout(id);
    }

    // cancel booking
    @PutMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        return managerBookingService.cancel(id);
    }
}