package com.microstay.bookingService.controller;

import com.microstay.bookingService.service.BookingStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/stats")
@RequiredArgsConstructor
public class BookingStatsController {

    private final BookingStatsService bookingStatsService;

    @GetMapping("/count")
    public Long countBookings() {
        return bookingStatsService.countBookings();
    }
}
