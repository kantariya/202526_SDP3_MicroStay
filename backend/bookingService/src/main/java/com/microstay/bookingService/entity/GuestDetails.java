package com.microstay.bookingService.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuestDetails {

    private String fullName;
    private String email;
    private String phone;
}
