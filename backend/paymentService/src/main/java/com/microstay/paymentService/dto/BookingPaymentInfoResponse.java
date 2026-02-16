package com.microstay.paymentService.dto;

import lombok.Data;

@Data
public class BookingPaymentInfoResponse {
    private Long bookingId;
    private String bookingReference;
    private String userId;
    private String status;
    private Double totalAmount;
    private String currency;
}

