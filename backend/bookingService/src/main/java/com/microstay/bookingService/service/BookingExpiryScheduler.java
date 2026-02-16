package com.microstay.bookingService.service;

import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.entity.BookingStatus;
import com.microstay.bookingService.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingExpiryScheduler {

    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    @Scheduled(fixedRate = 360000)
    public void expirePendingBookings() {

        List<Booking> expired =
                bookingRepository.findByStatusAndPaymentDueTimeBefore(
                        BookingStatus.INITIATED,
                        LocalDateTime.now()
                );

        for (Booking b : expired) {
            bookingService.releaseAfterPaymentFailure(b.getBookingId());
        }
    }
}
