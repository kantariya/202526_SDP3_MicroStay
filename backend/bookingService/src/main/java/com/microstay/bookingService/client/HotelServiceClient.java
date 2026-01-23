package com.microstay.bookingService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;

@FeignClient(name = "hotelService")
public interface HotelServiceClient {

    @PostMapping("/internal/hotels/{hotelId}/availability/check")
    AvailabilityResponse checkAvailability(
            @PathVariable String hotelId,
            @RequestBody AvailabilityRequest request);

    @PostMapping("/internal/hotels/{hotelId}/availability/reserve")
    AvailabilityResponse reserveRooms(
            @PathVariable String hotelId,
            @RequestBody ConfirmBookingRequest request);

    @PostMapping("/internal/hotels/{hotelId}/availability/release")
    void releaseRooms(
            @PathVariable String hotelId,
            @RequestBody ConfirmBookingRequest request);
}
