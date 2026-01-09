package com.microstay.hotelService.service.impl;

import com.microstay.hotelService.entity.HotelReview;
import com.microstay.hotelService.repository.ReviewRepository;
import com.microstay.hotelService.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public List<HotelReview> getReviews(String hotelId) {
        return reviewRepository.findByHotelId(hotelId);
    }

    @Override
    public HotelReview addReview(String hotelId, String userId, HotelReview review) {
        review.setHotelId(hotelId);
        review.setUserId(userId);
        review.setCreatedAt(Instant.now());
        return reviewRepository.save(review);
    }

    @Override
    public HotelReview updateReview(String reviewId, String userId, HotelReview review) {
        HotelReview existing = reviewRepository.findByIdAndUserId(reviewId, userId)
                .orElseThrow(() -> new RuntimeException("Unauthorized"));
        existing.setComment(review.getComment());
        existing.setRating(review.getRating());
        return reviewRepository.save(existing);
    }

    @Override
    public void deleteReview(String reviewId, String userId, String role) {
        if ("ADMIN".equals(role)) {
            reviewRepository.deleteById(reviewId);
        } else {
            HotelReview review = reviewRepository.findByIdAndUserId(reviewId, userId)
                    .orElseThrow(() -> new RuntimeException("Unauthorized"));
            reviewRepository.delete(review);
        }
    }
}
