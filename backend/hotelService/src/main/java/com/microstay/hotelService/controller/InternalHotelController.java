package com.microstay.hotelService.controller;

import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;
import com.microstay.hotelService.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/hotels")
@RequiredArgsConstructor
public class InternalHotelController {

    private final HotelService hotelService;

    /**
     * STEP 1: Booking Service checks availability
     * No inventory update happens here
     */
    @PostMapping("/{hotelId}/availability/check")
    public AvailabilityResponse checkAvailability(
            @PathVariable String hotelId,
            @RequestBody AvailabilityRequest request) {

        // Safety: ensure hotelId consistency
        request.setHotelId(hotelId);

        return hotelService.checkAvailability(request);
    }

    /**
     * STEP 2: Booking Service reserves rooms
     * Inventory is DECREMENTED here
     */
    @PostMapping("/{hotelId}/availability/reserve")
    public AvailabilityResponse reserveRooms(
            @PathVariable String hotelId,
            @RequestBody ConfirmBookingRequest request) {

        request.setHotelId(hotelId);

        return hotelService.confirmBooking(request);
    }

    /**
     * STEP 3: Booking cancellation / payment failure
     * Inventory is RESTORED here
     */
    @PostMapping("/{hotelId}/availability/release")
    public void releaseRooms(
            @PathVariable String hotelId,
            @RequestBody ConfirmBookingRequest request) {

        request.setHotelId(hotelId);

        hotelService.releaseBooking(request);
    }
}
