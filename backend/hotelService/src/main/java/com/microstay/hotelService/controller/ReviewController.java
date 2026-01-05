package com.microstay.hotelService.controller;

import com.microstay.hotelService.dto.ReviewRequestDto;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.Review;
import com.microstay.hotelService.service.ReviewService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Validated
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{hotelId}")
    public ResponseEntity<Hotel> addReview(
            @PathVariable @NotBlank(message = "Hotel ID cannot be blank") String hotelId,
            @RequestBody @Valid ReviewRequestDto dto,
            @RequestHeader("X-USER-ID") @NotNull(message = "User ID is required") @Positive(message = "User ID must be positive") Long userId
    ) {
        Review review = new Review();
        review.setUserId(userId);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        Hotel hotel = reviewService.addReview(hotelId, review);
        return ResponseEntity.status(HttpStatus.CREATED).body(hotel);
    }

    @DeleteMapping("/{hotelId}/{reviewId}")
    public ResponseEntity<Hotel> deleteReview(
            @PathVariable @NotBlank(message = "Hotel ID cannot be blank") String hotelId,
            @PathVariable @NotBlank(message = "Review ID cannot be blank") String reviewId,
            @RequestHeader("X-USER-ID") @NotNull(message = "User ID is required") @Positive(message = "User ID must be positive") Long userId
    ) {
        Hotel hotel = reviewService.deleteReview(hotelId, reviewId, userId);
        return ResponseEntity.ok(hotel);
    }
}
