package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminHotelService {

    private final HotelRepository hotelRepository;

    // Admin create hotel
    public Hotel createHotel(Hotel hotel) {

        hotel.setId(null); // ensure new
        hotel.setStatus("ACTIVE");
        hotel.setCreatedAt(Instant.now());
        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }

    // List hotels with optional filters
    public List<Hotel> listAllHotels(String status,
                                     String city,
                                     String managerId) {

        if (status == null && city == null && managerId == null) {
            return hotelRepository.findAll();
        }

        return hotelRepository.findFiltered(status, city, managerId);
    }

    // Change hotel status
    public Hotel changeStatus(String hotelId, String status) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.setStatus(status); // ACTIVE / INACTIVE
        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }

    // Assign manager
    public Hotel assignManager(String hotelId, String managerId) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.setManagerId(managerId);
        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }
}