package com.microstay.bookingService.dto;

import com.microstay.bookingService.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingPaymentInfoResponse {
    private Long bookingId;
    private String bookingReference;
    private String userId;
    private BookingStatus status;
    private Double totalAmount;
    private String currency;
}

