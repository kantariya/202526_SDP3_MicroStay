package com.microstay.paymentService.client;

import com.microstay.paymentService.dto.BookingPaymentInfoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "bookingService")
public interface BookingServiceClient {

    @GetMapping("/internal/bookings/{bookingId}")
    BookingPaymentInfoResponse getBookingForPayment(@PathVariable Long bookingId);

    @PostMapping("/internal/bookings/{bookingId}/confirm")
    void confirmBookingAfterPayment(@PathVariable Long bookingId);

    @PostMapping("/api/bookings/{bookingId}/release-after-payment-failure")
    void releaseAfterPaymentFailure(@PathVariable Long bookingId);

    @GetMapping("/api/bookings/my")
    com.microstay.paymentService.dto.UserBookingsResponse getUserBookings(
            @org.springframework.web.bind.annotation.RequestHeader("X-User-Id") String userId);

    @GetMapping("/api/bookings/manager")
    java.util.List<BookingPaymentInfoResponse> getManagerBookings(
            @org.springframework.web.bind.annotation.RequestHeader("X-User-Id") String userId);

    @PostMapping("/api/bookings/{bookingId}/mark-payment-success")
    void markPaymentSuccess(@PathVariable Long bookingId);
}
