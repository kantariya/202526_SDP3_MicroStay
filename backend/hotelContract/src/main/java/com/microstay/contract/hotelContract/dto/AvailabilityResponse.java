package com.microstay.contract.hotelContract.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {

    private boolean available;
    private String message;

    private Double totalAmount;
    private String currency;
}

