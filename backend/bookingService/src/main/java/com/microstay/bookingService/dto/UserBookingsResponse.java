package com.microstay.bookingService.dto;

import com.microstay.bookingService.entity.Booking;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserBookingsResponse {

    private List<Booking> bookings;

    private long upcomingCount;
    private long pastCount;
}
