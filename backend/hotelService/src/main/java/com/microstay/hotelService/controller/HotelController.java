package com.microstay.hotelService.controller;

import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;
import com.microstay.hotelService.dto.HotelCardResponse;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    // 1️⃣ Dashboard – minimal hotel cards
    @GetMapping
    public List<HotelCardResponse> getHotels(
            @RequestParam(required = false) String city
    ) {
        return hotelService.getHotelCards(city);
    }

    // 2️⃣ Hotel details page
    @GetMapping("/{hotelId}")
    public Hotel getHotelDetails(@PathVariable String hotelId) {
        return hotelService.getHotelDetails(hotelId);
    }

    // 3️⃣ Create hotel (ADMIN / HOTEL_MANAGER)
    @PostMapping
    public Hotel createHotel(@RequestBody Hotel hotel) {
        return hotelService.createHotel(hotel);
    }

    // 4️⃣ Update hotel details
    @PutMapping("/{hotelId}")
    public Hotel updateHotel(
            @PathVariable String hotelId,
            @RequestBody Hotel hotel
    ) {
        return hotelService.updateHotel(hotelId, hotel);
    }

    // 5️⃣ Delete hotel (ADMIN only)
    @DeleteMapping("/{hotelId}")
    public void deleteHotel(@PathVariable String hotelId) {
        hotelService.deleteHotel(hotelId);
    }

    @PostMapping("/check-availability")
    public AvailabilityResponse checkAvailability(
            @RequestBody AvailabilityRequest request) {

        return hotelService.checkAvailability(request);
    }

    @PostMapping("/confirm-booking")
    public AvailabilityResponse confirmBooking(
            @RequestBody ConfirmBookingRequest request) {

        return hotelService.confirmBooking(request);
    }
}
