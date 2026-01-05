package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.Review;
import com.microstay.hotelService.exception.ResourceNotFoundException;
import com.microstay.hotelService.exception.UnauthorizedException;
import com.microstay.hotelService.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final HotelRepository hotelRepository;

    public Hotel addReview(String hotelId, Review review) {
        // Validate hotelId
        if (!StringUtils.hasText(hotelId)) {
            throw new IllegalArgumentException("Hotel ID cannot be empty");
        }

        // VALIDATION: rating must be between 1 and 5 (already validated in DTO, but double-check)
        validateRating(review.getRating());

        // Validate comment
        if (!StringUtils.hasText(review.getComment())) {
            throw new IllegalArgumentException("Comment cannot be empty");
        }

        // Validate userId
        if (review.getUserId() == null || review.getUserId() <= 0) {
            throw new IllegalArgumentException("User ID is required and must be positive");
        }

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));

        // Check if user already reviewed this hotel
        boolean alreadyReviewed = hotel.getReviews().stream()
                .anyMatch(r -> r.getUserId().equals(review.getUserId()));
        
        if (alreadyReviewed) {
            throw new IllegalArgumentException("You have already reviewed this hotel");
        }

        review.setCreatedAt(LocalDateTime.now());
        hotel.getReviews().add(review);

        updateRating(hotel);
        
        log.info("Review added for hotel {} by user {}", hotelId, review.getUserId());
        return hotelRepository.save(hotel);
    }

    private void validateRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
    }

    private void updateRating(Hotel hotel) {
        if (hotel.getReviews() == null || hotel.getReviews().isEmpty()) {
            hotel.setAverageRating(0.0);
            hotel.setTotalReviews(0);
            return;
        }

        double avg = hotel.getReviews().stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        hotel.setAverageRating(Math.round(avg * 10.0) / 10.0); // Round to 1 decimal place
        hotel.setTotalReviews(hotel.getReviews().size());
    }

    public Hotel deleteReview(String hotelId, String reviewId, Long userId) {
        // Validate inputs
        if (!StringUtils.hasText(hotelId)) {
            throw new IllegalArgumentException("Hotel ID cannot be empty");
        }
        if (!StringUtils.hasText(reviewId)) {
            throw new IllegalArgumentException("Review ID cannot be empty");
        }
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("User ID is required and must be positive");
        }

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + hotelId));

        Review review = hotel.getReviews().stream()
                .filter(r -> r.getReviewId().equals(reviewId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        // Authorization: only review owner can delete
        if (!review.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this review");
        }

        hotel.getReviews().remove(review);

        updateRating(hotel);
        
        log.info("Review {} deleted for hotel {} by user {}", reviewId, hotelId, userId);
        return hotelRepository.save(hotel);
    }
}
