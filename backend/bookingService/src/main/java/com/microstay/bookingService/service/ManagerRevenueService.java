package com.microstay.bookingService.service;

import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.entity.BookingStatus;
import com.microstay.bookingService.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ManagerRevenueService {

    private final BookingRepository bookingRepository;

    public Map<String, Object> revenue(List<String> hotelIds) {

        List<BookingStatus> allowedStatuses = List.of(
                BookingStatus.CONFIRMED,
                BookingStatus.CHECKED_OUT
        );

        List<Booking> bookings =
                bookingRepository.findByHotelIdInAndStatusIn(
                        hotelIds,
                        allowedStatuses
                );

        double totalRevenue = bookings.stream()
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        return Map.of(
                "bookingCount", bookings.size(),
                "revenue", totalRevenue
        );
    }
}