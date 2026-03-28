package com.microstay.bookingService.repository;

import com.microstay.bookingService.entity.Booking;
import com.microstay.bookingService.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReference(String bookingReference);

    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Booking> findByStatusAndPaymentDueTimeBefore(
            BookingStatus status,
            LocalDateTime time
    );

    long countByUserIdAndCheckInDateGreaterThanEqualAndStatusNot(
            String userId,
            LocalDate date,
            com.microstay.bookingService.entity.BookingStatus status
    );

    long countByUserIdAndCheckOutDateLessThan(
            String userId,
            LocalDate date
    );
    List<Booking> findByHotelIdIn(List<String> hotelIds);

    List<Booking> findByHotelIdInAndStatusIn(
            List<String> hotelIds,
            List<BookingStatus> status
    );


    long countByHotelIdInAndCheckInDate(
            List<String> hotelIds,
            LocalDate date
    );

    Optional<Booking> findTopByUserIdAndHotelIdAndStatusOrderByCheckOutDateDesc(
            String userId,
            String hotelId,
            BookingStatus status
    );

}

