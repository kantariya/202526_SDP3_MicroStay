package com.microstay.hotelService.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    private String roomId;
    private String roomType; // STANDARD, DELUXE, SUITE

    private String description;

    private Integer maxAdults;
    private Integer maxChildren;

    private Pricing pricing;
    private Inventory inventory;

    private List<String> amenities;
    private List<String> images;

    // Availability per date
    private List<Availability> availability;

    private Boolean active;

    // ---------- Embedded Classes ----------

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Pricing {
        private Double basePrice;
        private String currency;
        private Double weekendMultiplier;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Inventory {
        private Integer totalRooms;
    }
}
