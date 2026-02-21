package com.microstay.bookingService.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;

import com.microstay.bookingService.dto.HotelResponse;
import java.util.List;

@FeignClient(name = "hotelService")
public interface HotelServiceClient {

        @GetMapping("/api/hotels/manager/my-hotels")
        List<HotelResponse> getMyHotels(@RequestHeader("X-User-Id") String userId);

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

        @PostMapping("/internal/hotels/release-booking")
        void releaseBooking(@RequestBody ConfirmBookingRequest request);
}
