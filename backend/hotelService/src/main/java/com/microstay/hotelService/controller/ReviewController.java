package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.HotelReview;
import com.microstay.hotelService.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels/{hotelId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<HotelReview>> getReviews(
            @PathVariable String hotelId
    ) {
        return ResponseEntity.ok(reviewService.getReviews(hotelId));
    }

    @PostMapping
    public ResponseEntity<HotelReview> addReview(
            @PathVariable String hotelId,
            @RequestHeader("X-User-Id") String userId,
            @RequestBody HotelReview review
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.addReview(hotelId, userId, review));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<HotelReview> updateReview(
            @PathVariable String reviewId,
            @RequestHeader("X-User-Id") String userId,
            @RequestBody HotelReview review
    ) {
        return ResponseEntity.ok(
                reviewService.updateReview(reviewId, userId, review)
        );
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String reviewId,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Role") String role
    ) {
        reviewService.deleteReview(reviewId, userId, role);
        return ResponseEntity.noContent().build();
    }
}
