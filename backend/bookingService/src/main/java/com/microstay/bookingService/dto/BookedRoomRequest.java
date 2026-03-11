package com.microstay.bookingService.dto;

import com.microstay.contract.hotelContract.dto.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookedRoomRequest {

    @NotBlank
    private String roomId;

    // Optional: frontend can send; otherwise defaults used
    private RoomType roomType;

    // Optional: frontend can send; otherwise defaults used
    @Min(0)
    private Double pricePerNight;

    @Min(1)
    private Integer numberOfRooms;

    @Min(1)
    private Integer adults;

    @Min(0)
    private Integer children;
}

