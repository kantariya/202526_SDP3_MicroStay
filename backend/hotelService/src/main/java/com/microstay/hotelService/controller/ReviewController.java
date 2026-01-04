package com.microstay.hotelService.controller;

import com.microstay.hotelService.dto.ReviewRequestDto;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.Review;
import com.microstay.hotelService.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{hotelId}")
    public Hotel addReview(
            @PathVariable String hotelId,
            @RequestBody @Valid ReviewRequestDto dto,
            @RequestHeader("X-USER-ID") Long userId
    ) {
        Review review = new Review();
        review.setUserId(userId);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        return reviewService.addReview(hotelId, review);
    }

}
