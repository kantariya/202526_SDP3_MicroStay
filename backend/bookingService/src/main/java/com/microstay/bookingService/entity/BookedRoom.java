package com.microstay.bookingService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booked_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"booking"})
@EqualsAndHashCode(exclude = {"booking"})
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
    @JsonBackReference("booking-rooms")
    private Booking booking;
}
