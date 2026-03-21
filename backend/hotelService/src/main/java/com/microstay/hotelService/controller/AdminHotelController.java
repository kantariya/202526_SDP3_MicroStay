package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.HotelStatus;
import com.microstay.hotelService.service.AdminHotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminHotelController {

    private final AdminHotelService adminHotelService;

    // Create hotel
    @PostMapping("/hotels")
    public Hotel createHotel(@RequestBody Hotel hotel) {
        return adminHotelService.createHotel(hotel);
    }

    // List hotels
    @GetMapping("/hotels")
    public Page<Hotel> listAllHotels(

            @RequestParam(required = false) HotelStatus status,
            @RequestParam(required = false) String managerId,
            @RequestParam(required = false) String nameSearch,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {

        List<HotelStatus> statuses = status != null
                ? List.of(status) 
                : List.of(HotelStatus.ACTIVE, HotelStatus.INACTIVE);

        return adminHotelService.listHotels(
                statuses,
                managerId,
                nameSearch,
                page,
                size,
                sortBy,
                direction
        );
    }

    // Change status
    @PutMapping("/hotels/{hotelId}/status")
    public Hotel changeStatus(
            @PathVariable String hotelId,
            @RequestParam HotelStatus status) {

        return adminHotelService.changeStatus(hotelId, status);
    }
    
    // Specific workflow endpoints
    @GetMapping("/hotel-approvals")
    public Page<Hotel> getHotelApprovals(
            @RequestParam(required = false) String nameSearch,
            @RequestParam(required = false) HotelStatus status,
            @RequestParam(required = false) String managerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        List<HotelStatus> statuses = status != null 
                ? List.of(status) 
                : List.of(HotelStatus.PENDING, HotelStatus.REJECTED);

        return adminHotelService.listHotels(statuses, managerId, nameSearch, page, size, sortBy, direction);
    }

    @PutMapping("/hotel/{hotelId}/approve")
    public Hotel approveHotel(@PathVariable String hotelId) {
        return adminHotelService.changeStatus(hotelId, HotelStatus.ACTIVE);
    }

    @PutMapping("/hotel/{hotelId}/reject")
    public Hotel rejectHotel(@PathVariable String hotelId) {
        return adminHotelService.changeStatus(hotelId, HotelStatus.REJECTED);
    }

    @PutMapping("/hotel/{hotelId}/inactive")
    public Hotel setInactive(@PathVariable String hotelId) {
        return adminHotelService.changeStatus(hotelId, HotelStatus.INACTIVE);
    }

    // Assign manager
    @PutMapping("/hotels/{hotelId}/manager")
    public Hotel assignManager(
            @PathVariable String hotelId,
            @RequestParam String managerId) {

        return adminHotelService.assignManager(hotelId, managerId);
    }

    @PutMapping("/hotels/{hotelId}/change-manager")
    public Hotel changeManager(
            @PathVariable String hotelId,
            @RequestParam String managerId) {
        return adminHotelService.assignManager(hotelId, managerId);
    }
}