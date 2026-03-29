package com.microstay.hotelService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotelCardResponse {

    private String id;
    private String name;
    private String city;
    private String country;
    private Integer starRating;
    private RatingSummary ratingSummary;
    private Double startingPrice;
    private String image;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingSummary {
        private Double average;
        private Integer totalReviews;
    }
}

