package com.microstay.userService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "HOTELSERVICE")
public interface HotelClient {

    @GetMapping("/internal/stats/count")
    Long countHotels();

    @GetMapping("/internal/stats/count")
    Long countHotelsByStatus(@RequestParam("status") String status);
}