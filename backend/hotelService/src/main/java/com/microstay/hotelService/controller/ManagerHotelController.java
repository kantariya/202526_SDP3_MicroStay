package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.*;
import com.microstay.hotelService.service.ManagerHotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager/hotels")
@RequiredArgsConstructor
public class ManagerHotelController {

    private final ManagerHotelService managerHotelService;

    @GetMapping
    public List<Hotel> myHotels() {
        return managerHotelService.myHotels();
    }

    @PutMapping("/{hotelId}")
    public Hotel updateHotel(
            @PathVariable String hotelId,
            @RequestBody Hotel updated) {

        return managerHotelService.updateHotel(hotelId, updated);
    }

    @PostMapping("/{hotelId}/rooms")
    public Hotel addRoom(
            @PathVariable String hotelId,
            @RequestBody Room room) {

        return managerHotelService.addRoom(hotelId, room);
    }

    @PutMapping("/{hotelId}/rooms/{roomId}")
    public Hotel updateRoom(
            @PathVariable String hotelId,
            @PathVariable String roomId,
            @RequestBody Room updated) {

        return managerHotelService.updateRoom(hotelId, roomId, updated);
    }

    @DeleteMapping("/{hotelId}/rooms/{roomId}")
    public Hotel deleteRoom(
            @PathVariable String hotelId,
            @PathVariable String roomId) {

        return managerHotelService.deleteRoom(hotelId, roomId);
    }

    @PutMapping("/{hotelId}/rooms/{roomId}/availability")
    public Hotel setAvailability(
            @PathVariable String hotelId,
            @PathVariable String roomId,
            @RequestBody Availability req) {

        return managerHotelService.setAvailability(hotelId, roomId, req);
    }
}