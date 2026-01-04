package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.Review;
import com.microstay.hotelService.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final HotelRepository hotelRepository;

    public Hotel addReview(String hotelId, Review review) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        review.setCreatedAt(LocalDateTime.now());
        hotel.getReviews().add(review);

        updateRating(hotel);
        return hotelRepository.save(hotel);
    }

    private void updateRating(Hotel hotel) {
        double avg = hotel.getReviews().stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        hotel.setAverageRating(avg);
        hotel.setTotalReviews(hotel.getReviews().size());
    }
}
