package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.exception.BadRequestException;
import com.microstay.hotelService.exception.ResourceNotFoundException;
import com.microstay.hotelService.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    public Hotel createHotel(Hotel hotel) {
        // Validate hotel data
        if (!StringUtils.hasText(hotel.getName())) {
            throw new BadRequestException("Hotel name is required");
        }
        if (!StringUtils.hasText(hotel.getCity())) {
            throw new BadRequestException("City is required");
        }
        if (hotel.getLatitude() == null || hotel.getLongitude() == null) {
            throw new BadRequestException("Latitude and longitude are required");
        }
        if (hotel.getLatitude() < -90 || hotel.getLatitude() > 90) {
            throw new BadRequestException("Latitude must be between -90 and 90");
        }
        if (hotel.getLongitude() < -180 || hotel.getLongitude() > 180) {
            throw new BadRequestException("Longitude must be between -180 and 180");
        }

        // Validate rooms if present
        if (hotel.getRooms() != null) {
            hotel.getRooms().forEach(room -> {
                if (room.getPricePerNight() != null && room.getPricePerNight() <= 0) {
                    throw new BadRequestException("Price per night must be positive");
                }
                if (room.getTotalRooms() != null && room.getTotalRooms() <= 0) {
                    throw new BadRequestException("Total rooms must be positive");
                }
            });
        }

        hotel.setAverageRating(0.0);
        hotel.setTotalReviews(0);
        hotel.setActive(true);
        
        log.info("Creating hotel: {}", hotel.getName());
        return hotelRepository.save(hotel);
    }

    public Hotel getHotel(String id) {
        if (!StringUtils.hasText(id)) {
            throw new BadRequestException("Hotel ID cannot be empty");
        }
        
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + id));
    }

    public List<Hotel> search(String city, Double rating) {
        // Validate city
        if (!StringUtils.hasText(city)) {
            throw new BadRequestException("City is required for search");
        }

        // Validate rating if provided
        if (rating != null) {
            if (rating < 0 || rating > 5) {
                throw new BadRequestException("Rating must be between 0 and 5");
            }
            log.info("Searching hotels with rating >= {} in city: {}", rating, city);
            return hotelRepository.findByAverageRatingGreaterThanEqual(rating);
        }
        
        log.info("Searching hotels in city: {}", city);
        return hotelRepository.findByCityAndActiveTrue(city);
    }
}
