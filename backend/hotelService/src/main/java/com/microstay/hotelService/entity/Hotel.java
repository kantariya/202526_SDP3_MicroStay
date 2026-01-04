package com.microstay.hotelService.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "hotels")
public class Hotel {

    @Id
    private String id;

    @Indexed
    private String name;

    @Indexed
    private String city;

    private String description;
    private String state;
    private String country;

    private Double latitude;
    private Double longitude;

    @Indexed
    private Double averageRating;

    private Integer totalReviews;

    private Long createdBy; // HOTEL_MANAGER userId
    private Boolean active = true;

    private List<Room> rooms;
    private List<Review> reviews;
}
