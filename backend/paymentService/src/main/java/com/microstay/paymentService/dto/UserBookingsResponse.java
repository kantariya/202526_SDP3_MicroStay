package com.microstay.paymentService.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserBookingsResponse {
    private List<BookingPaymentInfoResponse> bookings;
    // other fields ignored
}
