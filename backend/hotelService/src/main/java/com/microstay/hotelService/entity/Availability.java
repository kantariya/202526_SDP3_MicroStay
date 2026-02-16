package com.microstay.hotelService.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Availability {

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private Integer availableRooms;
}
