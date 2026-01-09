package com.microstay.hotelService.entity;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "hotels")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    private String id;

    private String name;
    private String brand;
    private String description;
    private Integer starRating;

    private Location location;
    private Contact contact;

    // Hotel policy times
    private String checkInTime;   // "14:00"
    private String checkOutTime;  // "11:00"

    private Policies policies;

    private List<String> facilities;
    private List<String> images;

    // Embedded rooms
    private List<Room> rooms;

    private String status; // ACTIVE / INACTIVE

    private Instant createdAt;
    private Instant updatedAt;

    // Aggregated rating (derived from reviews)
    private RatingSummary ratingSummary;

    // ---------- Embedded Classes ----------

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Location {
        private String address;
        private String city;
        private String state;
        private String country;
        private String pincode;
        private Geo geo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Geo {
        private String type; // "Point"
        private List<Double> coordinates; // [longitude, latitude]
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Contact {
        private String phone;
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Policies {
        private String cancellation;
        private Boolean petsAllowed;
        private Boolean smokingAllowed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingSummary {
        private Double average;
        private Integer totalReviews;
    }
}
