package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.*;
import com.microstay.hotelService.service.ManagerHotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager/hotels")
@RequiredArgsConstructor
public class ManagerHotelController {

    private final ManagerHotelService managerHotelService;

    @GetMapping
    public List<Hotel> myHotels(@RequestHeader("X-User-Id") String managerId) {
        return managerHotelService.myHotels(managerId);
    }

    @PostMapping
    public Hotel createHotel(
            @RequestBody Hotel hotel,
            @RequestHeader("X-User-Id") String managerId) {
        return managerHotelService.createHotel(hotel, managerId);
    }

    @GetMapping("/{hotelId}")
    public Hotel getHotel(@PathVariable String hotelId) {
        return managerHotelService.getHotel(hotelId);
    }

    @PutMapping("/{hotelId}")
    public Hotel updateHotel(
            @PathVariable String hotelId,
            @RequestBody Hotel updated,
            @RequestHeader("X-User-Id") String managerId) {

        return managerHotelService.updateHotel(hotelId, updated, managerId);
    }

    @PostMapping("/{hotelId}/rooms")
    public Hotel addRoom(
            @PathVariable String hotelId,
            @RequestBody Room room,
            @RequestHeader("X-User-Id") String managerId) {

        return managerHotelService.addRoom(hotelId, room, managerId);
    }

    @PutMapping("/{hotelId}/rooms/{roomId}")
    public Hotel updateRoom(
            @PathVariable String hotelId,
            @PathVariable String roomId,
            @RequestBody Room updated,
            @RequestHeader("X-User-Id") String managerId) {

        return managerHotelService.updateRoom(hotelId, roomId, updated, managerId);
    }

    @DeleteMapping("/{hotelId}/rooms/{roomId}")
    public Hotel deleteRoom(
            @PathVariable String hotelId,
            @PathVariable String roomId,
            @RequestHeader("X-User-Id") String managerId) {

        return managerHotelService.deleteRoom(hotelId, roomId, managerId);
    }

    @PutMapping("/{hotelId}/rooms/{roomId}/availability")
    public Hotel setAvailability(
            @PathVariable String hotelId,
            @PathVariable String roomId,
            @RequestBody Availability req,
            @RequestHeader("X-User-Id") String managerId) {

        return managerHotelService.setAvailability(hotelId, roomId, req, managerId);
    }
}