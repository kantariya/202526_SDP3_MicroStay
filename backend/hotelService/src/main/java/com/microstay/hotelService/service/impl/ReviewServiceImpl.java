package com.microstay.hotelService.service.impl;

import com.microstay.hotelService.client.BookingClient;
import com.microstay.hotelService.entity.HotelReview;
import com.microstay.hotelService.repository.ReviewRepository;
import com.microstay.hotelService.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingClient bookingClient;

    @Override
    public List<HotelReview> getReviews(String hotelId, String role) {
        if ("ADMIN".equals(role) || "HOTEL_MANAGER".equals(role)) {
            return reviewRepository.findByHotelId(hotelId);
        }
        return reviewRepository.findByHotelIdAndHiddenFalse(hotelId);
    }

    @Override
    public HotelReview addReview(String hotelId, String userId, HotelReview review) {

        // 1️⃣ Check eligibility via Booking Service
        Map<String, Object> response = bookingClient.checkEligibility(userId, hotelId);

        boolean eligible = Boolean.TRUE.equals(response.get("eligible"));

        if (!eligible) {
            throw new RuntimeException(
                    "You can only review within 3 days after checkout"
            );
        }

        // 2️⃣ Prevent duplicate reviews (optional but recommended)
        if (reviewRepository.existsByUserIdAndHotelId(userId, hotelId)) {
            throw new RuntimeException("You have already reviewed this hotel");
        }

        // 3️⃣ Set review data
        review.setHotelId(hotelId);
        review.setUserId(userId);
        review.setCreatedAt(Instant.now());

        // 4️⃣ Save review
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
