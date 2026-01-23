package com.microstay.contract.hotelContract.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AvailabilityResponse {

    private boolean available;
    private String message;

    private Double totalAmount;
    private String currency;
}

