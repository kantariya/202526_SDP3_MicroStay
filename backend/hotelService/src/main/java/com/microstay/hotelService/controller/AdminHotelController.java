package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.service.AdminHotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hotels")
@RequiredArgsConstructor
public class AdminHotelController {

    private final AdminHotelService adminHotelService;

    // Create hotel
    @PostMapping
    public Hotel createHotel(@RequestBody Hotel hotel) {
        return adminHotelService.createHotel(hotel);
    }

    // List hotels
    @GetMapping
    public List<Hotel> listAllHotels(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String managerId) {

        return adminHotelService.listAllHotels(status, city, managerId);
    }

    // Change status
    @PutMapping("/{hotelId}/status")
    public Hotel changeStatus(
            @PathVariable String hotelId,
            @RequestParam String status) {

        return adminHotelService.changeStatus(hotelId, status);
    }

    // Assign manager
    @PutMapping("/{hotelId}/manager")
    public Hotel assignManager(
            @PathVariable String hotelId,
            @RequestParam String managerId) {

        return adminHotelService.assignManager(hotelId, managerId);
    }
}