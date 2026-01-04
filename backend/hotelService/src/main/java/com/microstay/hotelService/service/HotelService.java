package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    public Hotel createHotel(Hotel hotel) {
        hotel.setAverageRating(0.0);
        hotel.setTotalReviews(0);
        return hotelRepository.save(hotel);
    }

    public Hotel getHotel(String id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    public List<Hotel> search(String city, Double rating) {
        if (rating != null) {
            return hotelRepository.findByAverageRatingGreaterThanEqual(rating);
        }
        return hotelRepository.findByCityAndActiveTrue(city);
    }
}
