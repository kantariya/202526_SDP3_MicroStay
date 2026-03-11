package com.microstay.bookingService.service;

import com.microstay.bookingService.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingStatsService {

    private final BookingRepository bookingRepository;

    // Total booking count
    public Long countBookings() {
        Long ans = bookingRepository.count();
        System.out.println("Total bookings: " + ans);
        return ans;
    }
}