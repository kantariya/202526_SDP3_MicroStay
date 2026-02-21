package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.*;
import com.microstay.hotelService.repository.HotelRepository;
import com.microstay.hotelService.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ManagerHotelService {

    private final HotelRepository hotelRepository;

    // ------------------------------------------------
    // helper — ownership check
    // ------------------------------------------------

    private void checkOwnership(Hotel hotel) {

        if (SecurityUtils.isAdmin()) return;

        String managerId = SecurityUtils.currentUserId();

        if (!managerId.equals(hotel.getManagerId())) {
            throw new RuntimeException("Not your hotel");
        }
    }

    private Hotel getHotel(String hotelId) {
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    // ------------------------------------------------
    // my hotels
    // ------------------------------------------------

    public List<Hotel> myHotels() {

        if (SecurityUtils.isAdmin()) {
            return hotelRepository.findAll();
        }

        return hotelRepository.findByManagerId(
                SecurityUtils.currentUserId());
    }

    // ------------------------------------------------
    // update hotel
    // ------------------------------------------------

    public Hotel updateHotel(String hotelId, Hotel updated) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel);

        hotel.setDescription(updated.getDescription());
        hotel.setFacilities(updated.getFacilities());
        hotel.setImages(updated.getImages());
        hotel.setContact(updated.getContact());
        hotel.setPolicies(updated.getPolicies());
        hotel.setCheckInTime(updated.getCheckInTime());
        hotel.setCheckOutTime(updated.getCheckOutTime());

        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }

    // ------------------------------------------------
    // add room
    // ------------------------------------------------

    public Hotel addRoom(String hotelId, Room room) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel);

        room.setRoomId(UUID.randomUUID().toString());

        if (hotel.getRooms() == null) {
            hotel.setRooms(new ArrayList<>());
        }

        hotel.getRooms().add(room);
        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }

    // ------------------------------------------------
    // update room
    // ------------------------------------------------

    public Hotel updateRoom(String hotelId,
                            String roomId,
                            Room updated) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel);

        hotel.getRooms().forEach(r -> {
            if (r.getRoomId().equals(roomId)) {
                r.setRoomType(updated.getRoomType());
                r.setDescription(updated.getDescription());
                r.setMaxAdults(updated.getMaxAdults());
                r.setMaxChildren(updated.getMaxChildren());
                r.setPricing(updated.getPricing());
                r.setAmenities(updated.getAmenities());
                r.setImages(updated.getImages());
                r.setActive(updated.getActive());
            }
        });

        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }

    // ------------------------------------------------
    // delete room
    // ------------------------------------------------

    public Hotel deleteRoom(String hotelId, String roomId) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel);

        hotel.getRooms()
                .removeIf(r -> r.getRoomId().equals(roomId));

        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }

    // ------------------------------------------------
    // set availability
    // ------------------------------------------------

    public Hotel setAvailability(String hotelId,
                                 String roomId,
                                 Availability req) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel);

        Room room = hotel.getRooms().stream()
                .filter(r -> r.getRoomId().equals(roomId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Room not found"));

        int max = room.getInventory().getTotalRooms();

        if (req.getAvailableRooms() > max) {
            throw new RuntimeException("Exceeds inventory");
        }

        if (room.getAvailability() == null) {
            room.setAvailability(new ArrayList<>());
        }

        room.getAvailability()
                .removeIf(a -> a.getDate().equals(req.getDate()));

        room.getAvailability().add(req);

        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }
}