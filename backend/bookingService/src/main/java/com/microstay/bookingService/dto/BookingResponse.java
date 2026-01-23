package com.microstay.bookingService.dto;

import com.microstay.bookingService.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {

    private String bookingReference;
    private BookingStatus status;
    private Double totalAmount;
    private String currency;
}

