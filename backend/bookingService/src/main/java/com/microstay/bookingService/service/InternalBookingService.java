package com.microstay.bookingService.service;

import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.entity.BookingStatus;
import com.microstay.bookingService.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class InternalBookingService {

    private final BookingRepository bookingRepository;


    public boolean isEligibleForReview(String userId, String hotelId) {

        Optional<Booking> bookingOpt =
                bookingRepository.findTopByUserIdAndHotelIdAndStatusOrderByCheckOutDateDesc(
                        userId, hotelId, BookingStatus.CONFIRMED
                );

        if (bookingOpt.isEmpty()) return false;

        Booking booking = bookingOpt.get();

        LocalDate today = LocalDate.now();
        LocalDate checkOut = booking.getCheckOutDate();
        LocalDate lastReviewDate = checkOut.plusDays(3);

        return !today.isBefore(checkOut) && !today.isAfter(lastReviewDate);
    }
}
