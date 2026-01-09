package com.microstay.hotelService.entity;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Availability {

    private LocalDate date;
    private Integer availableRooms;
}
