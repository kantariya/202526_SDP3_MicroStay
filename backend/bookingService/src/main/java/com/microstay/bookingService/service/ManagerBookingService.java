package com.microstay.bookingService.service;

import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.entity.BookingStatus;
import com.microstay.bookingService.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerBookingService {

    private final BookingRepository bookingRepository;

    // Today booking count
    public long todayCount(List<String> hotelIds) {
        return bookingRepository.countByHotelIdInAndCheckInDate(
                hotelIds,
                LocalDate.now());
    }

    // List bookings
    public List<Booking> list(List<String> hotelIds) {
        return bookingRepository.findByHotelIdIn(hotelIds);
    }

    // Get booking by id
    public Booking getOne(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // Check-in
    public Booking checkin(Long id) {

        Booking booking = getOne(id);

        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Check-out
    public Booking checkout(Long id) {

        Booking booking = getOne(id);

        booking.setStatus(BookingStatus.CHECKED_OUT);
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Manager cancel
    public Booking cancel(Long id) {

        Booking booking = getOne(id);

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }
}