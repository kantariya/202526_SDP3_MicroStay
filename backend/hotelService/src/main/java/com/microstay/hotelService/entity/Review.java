package com.microstay.hotelService.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Review {
    private Long userId;
    private Integer rating; // 1-5
    private String comment;
    private LocalDateTime createdAt;
}
