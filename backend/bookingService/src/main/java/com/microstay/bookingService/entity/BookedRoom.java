package com.microstay.bookingService.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booked_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookedRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomId;
    private String roomType;

    private Integer adults;
    private Integer children;

    private Double pricePerNight;
    private Integer numberOfRooms;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
}
