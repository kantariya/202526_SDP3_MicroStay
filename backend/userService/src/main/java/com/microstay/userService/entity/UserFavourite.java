package com.microstay.userService.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "user_favourites",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "hotel_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFavourite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String hotelId;

    private Instant createdAt;
}
