package com.microstay.paymentService.repository;

import com.microstay.paymentService.entity.Payment;
import com.microstay.paymentService.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Long bookingId);

    List<Payment> findByStatus(PaymentStatus status);

    List<Payment> findByBookingIdIn(List<Long> bookingIds);
}
