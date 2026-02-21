package com.microstay.bookingService.service;

import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.entity.BookingStatus;
import com.microstay.bookingService.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminBookingService {

    private final BookingRepository bookingRepository;

    // List all bookings with filters
    public List<Booking> listBookings(String status, String hotelId) {

        List<Booking> all = bookingRepository.findAll();

        if (status != null && !status.isBlank()) {
            all = all.stream()
                    .filter(b -> b.getStatus() != null &&
                            b.getStatus().name().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        if (hotelId != null && !hotelId.isBlank()) {
            all = all.stream()
                    .filter(b -> hotelId.equals(String.valueOf(b.getHotelId())))
                    .collect(Collectors.toList());
        }

        return all;
    }

    // Get booking details
    public Booking getBooking(String id) {
        return bookingRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // Admin cancel booking
    public Booking adminCancel(String id) {

        Booking booking = bookingRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);

        return bookingRepository.save(booking);
    }
}