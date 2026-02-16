package com.microstay.contract.hotelContract.dto;

import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmBookingRequest {

    private String hotelId;
    private String roomId;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private Integer roomsRequired;

    // Future-proof
    private String bookingId;
}
