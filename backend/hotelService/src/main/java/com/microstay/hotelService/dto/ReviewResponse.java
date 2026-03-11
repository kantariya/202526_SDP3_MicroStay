package com.microstay.hotelService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ReviewResponse {

    private String reviewId;
    private String hotelId;
    private String userId;
    private String username;
    private Double rating;
    private String comment;
    private Instant createdAt;
}
