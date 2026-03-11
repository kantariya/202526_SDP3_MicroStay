package com.microstay.bookingService.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestDetails {

    private String fullName;

    private Integer age;

    private String aadharNumber;
}
    