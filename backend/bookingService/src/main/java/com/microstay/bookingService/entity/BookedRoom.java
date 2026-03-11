package com.microstay.bookingService.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.microstay.contract.hotelContract.dto.RoomType;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false, columnDefinition = "VARCHAR(50)")
    private RoomType roomType;

    private Integer adults;
    private Integer children;

    private Double pricePerNight;
    private Integer numberOfRooms;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonBackReference("booking-rooms")
    private Booking booking;
}
