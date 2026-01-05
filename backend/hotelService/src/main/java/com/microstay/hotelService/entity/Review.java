package com.microstay.hotelService.entity;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
public class Review {

    @Indexed
    private String reviewId = UUID.randomUUID().toString();

    private Long userId;
    private Integer rating; // 1-5
    private String comment;
    private LocalDateTime createdAt;
}
