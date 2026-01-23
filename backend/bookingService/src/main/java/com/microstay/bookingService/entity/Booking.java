package com.microstay.bookingService.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private String bookingReference; // UUID / human readable

    private String userId; // from JWT (API Gateway)

    @Embedded
    private GuestDetails guestDetails;

    private String hotelId;
    private String hotelName;

    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private Integer totalRooms;
    private Integer totalGuests;

    private Double totalAmount;
    private String currency;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<BookedRoom> rooms;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    private Payment payment;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
