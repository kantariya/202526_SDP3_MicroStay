package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.HotelStatus;
import com.microstay.hotelService.service.HotelStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/stats")
@RequiredArgsConstructor
public class HotelStatsController {

    private final HotelStatsService hotelStatsService;

    @GetMapping("/count")
    public Long countHotels(@RequestParam(required = false) HotelStatus status) {
        if (status != null) {
            return hotelStatsService.countHotelsByStatus(status);
        }
        return hotelStatsService.countHotels();
    }
}
