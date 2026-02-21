package com.microstay.hotelService.service;

import com.microstay.hotelService.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HotelStatsService {

    private final HotelRepository hotelRepository;

    // Total hotel count
    public Long countHotels() {
        return hotelRepository.count();
    }

    public Long countHotelsByStatus(String status) {
        return hotelRepository.countByStatus(status);
    }
}
