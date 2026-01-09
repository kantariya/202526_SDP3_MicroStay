package com.microstay.hotelService.entity;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "hotel_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelReview {

    @Id
    private String id;

    private String hotelId;
    private String userId;

    private Double rating;   // 1.0 to 5.0
    private String comment;  // review text

    private Instant createdAt;
}
