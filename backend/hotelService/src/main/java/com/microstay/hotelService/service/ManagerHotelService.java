package com.microstay.hotelService.service;

import com.microstay.hotelService.client.dto.Role;
import com.microstay.hotelService.entity.*;
import com.microstay.hotelService.repository.HotelRepository;
import com.microstay.hotelService.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.microstay.hotelService.client.UserClient;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ManagerHotelService {

    private final HotelRepository hotelRepository;
    private final UserClient userClient;

    // ------------------------------------------------
    // helper — ownership check
    // ------------------------------------------------

    private void checkOwnership(Hotel hotel,String managerId) {
        ResponseEntity<Role> response =
                userClient.getUserRole(Long.parseLong(managerId));

        Role role = Role.USER;

        if (response.getStatusCode().is2xxSuccessful() || response.getBody() != null) {
            role = response.getBody();
        }


        if (role==Role.ADMIN) return;

        if (!managerId.equals(hotel.getManagerId())) {
            throw new RuntimeException("Not your hotel");
        }
    }

    public Hotel getHotel(String hotelId) {
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    // ------------------------------------------------
    // my hotels
    // ------------------------------------------------

    public List<Hotel> myHotels(String managerId) {

        if (SecurityUtils.isAdmin()) {
            return hotelRepository.findAll();
        }

        return hotelRepository.findByManagerId(managerId);
    }

    // ------------------------------------------------
    // create hotel
    // ------------------------------------------------

    public Hotel createHotel(Hotel hotel, String managerId) {
        hotel.setId(null); // Ensure new
        hotel.setManagerId(managerId);
        hotel.setStatus(HotelStatus.PENDING);
        hotel.setCreatedAt(Instant.now());
        hotel.setUpdatedAt(Instant.now());
        hotel.setRooms(new ArrayList<>());
        
        return hotelRepository.save(hotel);
    }

    // ------------------------------------------------
    // update hotel
    // ------------------------------------------------

    public Hotel updateHotel(String hotelId, Hotel updated, String managerId) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel, managerId);

        // ===== BASIC INFO =====
        hotel.setName(updated.getName());
        hotel.setBrand(updated.getBrand());
        hotel.setDescription(updated.getDescription());
        hotel.setStarRating(updated.getStarRating());

        hotel.setCheckInTime(updated.getCheckInTime());
        hotel.setCheckOutTime(updated.getCheckOutTime());

        // ===== FACILITIES & IMAGES =====
        hotel.setFacilities(updated.getFacilities());
        hotel.setImages(updated.getImages());

        // ===== LOCATION =====
        if (hotel.getLocation() == null) {
            hotel.setLocation(new Hotel.Location());
        }

        Hotel.Location updatedLocation = updated.getLocation();
        Hotel.Location location = hotel.getLocation();

        if (updatedLocation != null) {
            location.setAddress(updatedLocation.getAddress());
            location.setCity(updatedLocation.getCity());
            location.setState(updatedLocation.getState());
            location.setCountry(updatedLocation.getCountry());
            location.setPincode(updatedLocation.getPincode());

            if (updatedLocation.getGeo() != null) {
                location.setGeo(updatedLocation.getGeo());
            }
        }

        // ===== CONTACT =====
        if (hotel.getContact() == null) {
            hotel.setContact(new Hotel.Contact());
        }

        Hotel.Contact updatedContact = updated.getContact();
        if (updatedContact != null) {
            hotel.getContact().setPhone(updatedContact.getPhone());
            hotel.getContact().setEmail(updatedContact.getEmail());
        }

        // ===== POLICIES =====
        if (hotel.getPolicies() == null) {
            hotel.setPolicies(new Hotel.Policies());
        }

        Hotel.Policies updatedPolicies = updated.getPolicies();
        if (updatedPolicies != null) {
            hotel.getPolicies().setCancellation(updatedPolicies.getCancellation());
            hotel.getPolicies().setPetsAllowed(updatedPolicies.getPetsAllowed());
            hotel.getPolicies().setSmokingAllowed(updatedPolicies.getSmokingAllowed());
        }

        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }

    // ------------------------------------------------
    // add room
    // ------------------------------------------------

    public Hotel addRoom(String hotelId, Room room,String managerId) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel,managerId);

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
                            Room updated,
                            String managerId) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel,managerId);

        hotel.getRooms().forEach(r -> {
            if (r.getRoomId().equals(roomId)) {
                r.setRoomType(updated.getRoomType());
                r.setDescription(updated.getDescription());
                r.setMaxAdults(updated.getMaxAdults());
                r.setMaxChildren(updated.getMaxChildren());
                r.setPricing(updated.getPricing());
                r.setInventory(updated.getInventory());
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

    public Hotel deleteRoom(String hotelId, String roomId,String managerId) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel,managerId);

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
                                 Availability req,
                                 String managerId) {

        Hotel hotel = getHotel(hotelId);
        checkOwnership(hotel,managerId);

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