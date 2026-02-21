package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.HotelReview;
import com.microstay.hotelService.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminReviewService {

    private final ReviewRepository reviewRepository;

    // List reviews (all or by hotel)
    public List<HotelReview> list(String hotelId) {

        if (hotelId != null && !hotelId.isBlank()) {
            return reviewRepository.findByHotelId(hotelId);
        }

        return reviewRepository.findAll();
    }

    // Hide review
    public HotelReview hide(String id) {

        HotelReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setHidden(true);

        return reviewRepository.save(review);
    }

    // Unhide review
    public HotelReview unhide(String id) {

        HotelReview review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setHidden(false);

        return reviewRepository.save(review);
    }

    // Delete review
    public void delete(String id) {
        reviewRepository.deleteById(id);
    }
}