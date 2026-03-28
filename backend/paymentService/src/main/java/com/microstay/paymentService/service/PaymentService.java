package com.microstay.paymentService.service;

import com.microstay.paymentService.client.BookingServiceClient;
import com.microstay.paymentService.dto.BookingPaymentInfoResponse;
import com.microstay.paymentService.dto.PaymentRequest;
import com.microstay.paymentService.dto.PaymentResponse;
import com.microstay.paymentService.entity.Payment;
import com.microstay.paymentService.entity.PaymentStatus;
import com.microstay.paymentService.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingServiceClient bookingServiceClient;

    public PaymentResponse createMockPayment(PaymentRequest request, String userIdHeader) {

        Long bookingId = request.getBookingId(); // ✅ ensure Long type

        // ✅ prevent duplicate payment per booking
        paymentRepository.findByBookingId(bookingId).ifPresent(p -> {
            throw new ResponseStatusException(CONFLICT, "Payment already exists for this booking");
        });

        // ✅ fetch booking snapshot from booking-service
        BookingPaymentInfoResponse booking;
        try {
            booking = bookingServiceClient.getBookingForPayment(bookingId);
        } catch (Exception ex) {
            throw new ResponseStatusException(NOT_FOUND, "Booking not found");
        }

        // ✅ user ownership check
        if (userIdHeader != null && !userIdHeader.isBlank()
                && booking.getUserId() != null
                && !userIdHeader.equals(booking.getUserId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking does not belong to this user");
        }

        // ✅ status check
        if (booking.getStatus() != null) {
            String st = booking.getStatus().toUpperCase(Locale.ROOT);
            if ("CANCELLED".equals(st) || "FAILED".equals(st)) {
                throw new ResponseStatusException(BAD_REQUEST, "Cannot pay for a " + st + " booking");
            }
            if ("CONFIRMED".equals(st)) {
                throw new ResponseStatusException(CONFLICT, "Booking already paid");
            }
        }

        // ✅ currency check
        if (booking.getCurrency() != null
                && !booking.getCurrency().equalsIgnoreCase(request.getCurrency())) {
            throw new ResponseStatusException(BAD_REQUEST, "Currency mismatch for booking");
        }

        // ✅ amount check
        if (booking.getTotalAmount() != null) {
            double expected = booking.getTotalAmount();
            double actual = request.getAmount();
            if (Math.abs(expected - actual) > 0.01) {
                System.out.println("Amount mismatch: expected " + expected + " but got " + actual);
                throw new ResponseStatusException(BAD_REQUEST, "Amount mismatch for booking");
            }
        }

        // ✅ decide mock result
        PaymentStatus status = "SUCCESS".equalsIgnoreCase(request.getMockResult())
                ? PaymentStatus.SUCCESS
                : PaymentStatus.FAILED;

        // ✅ create payment record
        Payment payment = Payment.builder()
                .paymentGateway("MOCK")
                .gatewayPaymentId(UUID.randomUUID().toString())
                .gatewayOrderId(UUID.randomUUID().toString())
                .amount(request.getAmount())
                .currency(request.getCurrency().toUpperCase(Locale.ROOT))
                .status(status)
                .paymentTime(LocalDateTime.now())
                .bookingId(bookingId)
                .build();

        paymentRepository.save(payment);

        // ✅ notify booking service (THIS IS THE FIX)
        try {
            System.out.println("Payment " + status + " for booking " + bookingId + ", notifying booking service");

            if (status == PaymentStatus.SUCCESS) {
                markPaymentSuccessWithResilience(bookingId);
            } else {
                System.out
                        .println("Payment failed for booking " + bookingId + ", notifying booking service to release");
                releaseAfterPaymentFailureWithResilience(bookingId);
            }

        } catch (Exception ex) {
            // do NOT fail payment record — log only
            log.error("Booking service callback failed for booking {}", bookingId, ex);
        }

        return toResponse(payment);
    }

    public PaymentResponse getById(Long paymentId, String userId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Payment not found"));

        verifyOwnership(payment.getBookingId(), userId);

        return toResponse(payment);
    }

    public PaymentResponse getByBookingId(Long bookingId, String userId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Payment not found for booking"));

        verifyOwnership(bookingId, userId);

        return toResponse(payment);
    }

    private void verifyOwnership(Long bookingId, String userId) {
        if (userId == null)
            return; // public/system call? or maybe throw error. For now, strict if userId provided.
        // If we want to strictly enforce, we should require userId.

        verifyOwnershipWithResilience(bookingId, userId);
    }

    private void verifyOwnershipWithResilience(Long bookingId, String userId) {
        try {
            BookingPaymentInfoResponse booking = bookingServiceClient.getBookingForPayment(bookingId);
            if (!userId.equals(booking.getUserId())) {
                throw new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Access Denied");
            }
        } catch (Exception e) {
            // If booking service down or booking not found, determining ownership is hard.
            // Fail safe:
            log.error("Could not verify booking ownership for payment lookup", e);
            throw new ResponseStatusException(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR,
                    "Verification failed");
        }
    }

    private PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .bookingId(payment.getBookingId())
                .paymentGateway(payment.getPaymentGateway())
                .gatewayPaymentId(payment.getGatewayPaymentId())
                .gatewayOrderId(payment.getGatewayOrderId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .paymentTime(payment.getPaymentTime())
                .build();
    }

    public java.util.List<PaymentResponse> getPaymentsForUser(String userId) {
        // 1. Get user bookings
        com.microstay.paymentService.dto.UserBookingsResponse response = bookingServiceClient.getUserBookings(userId);

        if (response == null || response.getBookings() == null || response.getBookings().isEmpty()) {
            return java.util.List.of();
        }

        java.util.List<Long> bookingIds = response.getBookings().stream()
                .map(com.microstay.paymentService.dto.BookingPaymentInfoResponse::getBookingId)
                .toList();

        return paymentRepository.findByBookingIdIn(bookingIds).stream()
                .map(this::toResponse)
                .toList();
    }

    public java.util.List<PaymentResponse> getPaymentsForManager(String userId) {
        // 1. Get manager bookings (which are already filtered by owned hotels)
        java.util.List<com.microstay.paymentService.dto.BookingPaymentInfoResponse> bookings = bookingServiceClient
                .getManagerBookings(userId);

        if (bookings == null || bookings.isEmpty()) {
            return java.util.List.of();
        }

        java.util.List<Long> bookingIds = bookings.stream()
                .map(com.microstay.paymentService.dto.BookingPaymentInfoResponse::getBookingId)
                .toList();

        return paymentRepository.findByBookingIdIn(bookingIds).stream()
                .map(this::toResponse)
                .toList();
    }

    private void markPaymentSuccessWithResilience(Long bookingId) {
        bookingServiceClient.markPaymentSuccess(bookingId);
    }

    private void releaseAfterPaymentFailureWithResilience(Long bookingId) {
        bookingServiceClient.releaseAfterPaymentFailure(bookingId);
    }
}
