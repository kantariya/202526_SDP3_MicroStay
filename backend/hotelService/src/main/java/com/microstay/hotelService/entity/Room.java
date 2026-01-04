package com.microstay.hotelService.entity;

import lombok.Data;

@Data
public class Room {
    private String roomType; // SINGLE, DOUBLE, DELUXE
    private Double pricePerNight;
    private Integer totalRooms;
}
