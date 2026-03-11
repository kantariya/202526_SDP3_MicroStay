package com.microstay.hotelService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HotelCardResponse {

    private String id;
    private String name;
    private String city;
    private String country;
    private Integer starRating;
    private Double averageRating;
    private Double startingPrice;
    private String image;
}

