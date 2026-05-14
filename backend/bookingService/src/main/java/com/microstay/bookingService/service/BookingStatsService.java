package com.microstay.bookingService.service;

import com.microstay.bookingService.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingStatsService {

    private final BookingRepository bookingRepository;

    // Total booking count
    public Long countBookings() {
        Long ans = bookingRepository.count();
        log.info("Total bookings counted={}", ans);
        return ans;
    }
}