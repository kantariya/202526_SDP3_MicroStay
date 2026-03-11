package com.microstay.bookingService.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@ToString(exclude = {"rooms"})
@EqualsAndHashCode(exclude = {"rooms"})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private String bookingReference; // UUID / human readable

    private String userId; // from JWT (API Gateway)

    @ElementCollection
    @CollectionTable(
            name = "booking_guests",
            joinColumns = @JoinColumn(name = "booking_id")
    )
    private List<GuestDetails> guestDetails;

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
    @JsonManagedReference("booking-rooms")
    private List<BookedRoom> rooms;

    private LocalDateTime paymentDueTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
