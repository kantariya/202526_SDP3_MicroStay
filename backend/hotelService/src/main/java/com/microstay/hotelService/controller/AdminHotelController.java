package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.HotelStatus;
import com.microstay.hotelService.service.AdminHotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;



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
    public Page<Hotel> listAllHotels(

            @RequestParam(required = false) HotelStatus status,
            @RequestParam(required = false) String managerId,
            @RequestParam(required = false) String nameSearch,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {

        return adminHotelService.listHotels(
                status,
                managerId,
                nameSearch,
                page,
                size,
                sortBy,
                direction
        );
    }

    // Change status
    @PutMapping("/{hotelId}/status")
    public Hotel changeStatus(
            @PathVariable String hotelId,
            @RequestParam HotelStatus status) {

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