package com.microstay.userService.service;

import com.microstay.userService.client.BookingClient;
import com.microstay.userService.client.HotelClient;
import com.microstay.userService.dto.AdminStatsResponse;
import com.microstay.userService.entity.Role;
import com.microstay.userService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;
    private final HotelClient hotelClient;
    private final BookingClient bookingClient;

    public AdminStatsResponse getAdminStats() {

        long totalUsers = userRepository.countByRole(Role.USER);
        long totalManagers = userRepository.countByRole(Role.HOTEL_MANAGER);

        Long hotels = safeCall(() -> hotelClient.countHotels());
        Long pendingHotels = safeCall(() -> hotelClient.countHotelsByStatus("PENDING"));
        Long bookings = safeCall(() -> bookingClient.countBookings());

        return new AdminStatsResponse(
                totalUsers,
                totalManagers,
                hotels,
                pendingHotels,
                bookings);
    }

    private Long safeCall(Supplier<Long> supplier) {
        try {
            return supplier.get();
        } catch (Exception e) {
            System.out.println("Error calling external service: " + e.getMessage());
            return 0L;
        }
    }
}