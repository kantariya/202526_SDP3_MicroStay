package com.microstay.userService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "BOOKINGSERVICE")
public interface BookingClient {

    @GetMapping("/internal/stats/count")
    Long countBookings();
}