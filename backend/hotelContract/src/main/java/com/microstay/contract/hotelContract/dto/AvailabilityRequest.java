package com.microstay.contract.hotelContract.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class AvailabilityRequest {

    private String hotelId;
    private String roomId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private Integer roomsRequired;
}

