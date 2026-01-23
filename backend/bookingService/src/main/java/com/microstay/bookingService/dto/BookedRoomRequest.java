package com.microstay.bookingService.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookedRoomRequest {

    @NotBlank
    private String roomId;

    @Min(1)
    private Integer numberOfRooms;

    @Min(1)
    private Integer adults;

    @Min(0)
    private Integer children;
}

