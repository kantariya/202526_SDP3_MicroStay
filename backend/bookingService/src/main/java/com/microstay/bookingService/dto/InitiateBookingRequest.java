package com.microstay.bookingService.dto;

import com.microstay.bookingService.entity.GuestDetails;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class InitiateBookingRequest {

    @NotBlank
    private String hotelId;

    @NotNull
    private LocalDate checkInDate;

    @NotNull
    private LocalDate checkOutDate;

    @NotEmpty
    private List<BookedRoomRequest> rooms;

    @Valid
    private GuestDetails guestDetails;
}

