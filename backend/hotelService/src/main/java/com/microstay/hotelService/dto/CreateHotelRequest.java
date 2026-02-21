package com.microstay.hotelService.dto;

import lombok.Data;

@Data
public class CreateHotelRequest {

    private String name;
    private String city;
    private String address;
    private String managerId;
}
