package com.microstay.paymentService.service;

import com.microstay.paymentService.entity.Payment;
import com.microstay.paymentService.entity.PaymentStatus;
import com.microstay.paymentService.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPaymentService {

    private final PaymentRepository paymentRepository;

    // list payments with optional filters
    public List<Payment> list(Long bookingId,
                              PaymentStatus status) {

        if (bookingId != null) {
            return paymentRepository.findByBookingId(bookingId)
                    .map(List::of)
                    .orElse(List.of());
        }

        if (status != null) {
            return paymentRepository.findByStatus(status);
        }

        return paymentRepository.findAll();
    }

    // payment detail
    public Payment getOne(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // admin override payment status
    public Payment updateStatus(Long id,
                                PaymentStatus status) {

        Payment payment = getOne(id);

        payment.setStatus(status);
        payment.setPaymentTime(LocalDateTime.now());

        return paymentRepository.save(payment);
    }
}
