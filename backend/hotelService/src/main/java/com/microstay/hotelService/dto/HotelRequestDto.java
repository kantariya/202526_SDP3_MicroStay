package com.microstay.hotelService.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Data
public class HotelRequestDto {

    @NotBlank
    private String name;

    private String description;

    @NotBlank
    private String city;

    private String state;
    private String country;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private List<RoomDto> rooms;

    // nested DTO for rooms
    @Data
    public static class RoomDto {
        @NotBlank
        private String roomType;   // SINGLE, DOUBLE, DELUXE

        @NotNull
        private Double pricePerNight;

        @NotNull
        private Integer totalRooms;
    }
}
