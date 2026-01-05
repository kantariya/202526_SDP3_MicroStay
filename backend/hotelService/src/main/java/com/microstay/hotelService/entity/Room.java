package com.microstay.hotelService.entity;

import lombok.Data;

import java.util.List;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.UUID;

@Data
public class Room {

    @Indexed
    private String roomId = UUID.randomUUID().toString();

    private String roomType; // SINGLE, DOUBLE, DELUXE
    private Double pricePerNight;
    private Integer totalRooms;

    private List<String> imageUrls;
}
