package com.microstay.userService.controller;

import com.microstay.userService.dto.AdminStatsResponse;
import com.microstay.userService.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        return adminStatsService.getAdminStats();
    }
}