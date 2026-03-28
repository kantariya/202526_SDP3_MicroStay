package com.microstay.hotelService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Map;

@FeignClient(name = "bookingService")
public interface BookingClient {

    @GetMapping("internal/bookings/eligible-for-review/{hotelId}")
    Map<String, Object> checkEligibility(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable("hotelId") String hotelId
    );
}
