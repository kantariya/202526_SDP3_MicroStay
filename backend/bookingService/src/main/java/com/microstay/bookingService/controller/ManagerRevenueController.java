package com.microstay.bookingService.controller;

import com.microstay.bookingService.service.ManagerRevenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager/revenue")
@RequiredArgsConstructor
public class ManagerRevenueController {

        private final ManagerRevenueService managerRevenueService;

        @GetMapping
        public Map<String, Object> revenue(
                @RequestParam List<String> hotelIds) {

                return managerRevenueService.revenue(hotelIds);
        }
}