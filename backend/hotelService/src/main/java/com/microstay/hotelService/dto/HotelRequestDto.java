package com.microstay.hotelService.dto;

import lombok.Data;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

@Data
public class HotelRequestDto {

    @NotBlank(message = "Hotel name is required")
    @Size(min = 2, max = 100, message = "Hotel name must be between 2 and 100 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotBlank(message = "City is required")
    @Size(min = 2, max = 100, message = "City must be between 2 and 100 characters")
    private String city;

    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    @Valid
    private List<RoomDto> rooms;

    // nested DTO for rooms
    @Data
    public static class RoomDto {
        @NotBlank(message = "Room type is required")
        @Pattern(regexp = "^(SINGLE|DOUBLE|DELUXE|SUITE|FAMILY)$", 
                 message = "Room type must be one of: SINGLE, DOUBLE, DELUXE, SUITE, FAMILY")
        private String roomType;

        @NotNull(message = "Price per night is required")
        @Positive(message = "Price per night must be a positive number")
        @DecimalMin(value = "0.01", message = "Price per night must be at least 0.01")
        @DecimalMax(value = "999999.99", message = "Price per night must not exceed 999999.99")
        private Double pricePerNight;

        @NotNull(message = "Total rooms is required")
        @Min(value = 1, message = "Total rooms must be at least 1")
        @Max(value = 1000, message = "Total rooms must not exceed 1000")
        private Integer totalRooms;
    }
}
