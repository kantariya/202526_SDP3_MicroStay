package com.microstay.hotelService.service.impl;

import com.microstay.hotelService.dto.HotelCardResponse;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.repository.HotelRepository;
import com.microstay.hotelService.service.HotelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;

    @Override
    public List<HotelCardResponse> getHotelCards(String city) {
        List<Hotel> hotels = city == null
                ? hotelRepository.findAll()
                : hotelRepository.findByLocation_City(city);

        log.info("Hotel list: {}", hotels);

        return hotels.stream().map(h ->
                new HotelCardResponse(
                        h.getId(),
                        h.getName(),
                        h.getLocation().getCity(),
                        h.getStarRating(),
                        h.getRatingSummary() != null ? h.getRatingSummary().getAverage() : 0.0,
                        h.getRooms().stream()
                                .map(r -> r.getPricing().getBasePrice())
                                .min(Double::compareTo)
                                .orElse(0.0),
                        h.getImages().isEmpty() ? null : h.getImages().get(0)
                )
        ).toList();
    }

    @Override
    public Hotel getHotelDetails(String hotelId) {
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    @Override
    public Hotel createHotel(Hotel hotel) {
        hotel.setCreatedAt(Instant.now());
        hotel.setUpdatedAt(Instant.now());
        return hotelRepository.save(hotel);
    }

    @Override
    public Hotel updateHotel(String hotelId, Hotel hotel) {
        Hotel existing = getHotelDetails(hotelId);
        hotel.setId(existing.getId());
        hotel.setCreatedAt(existing.getCreatedAt());
        hotel.setUpdatedAt(Instant.now());
        return hotelRepository.save(hotel);
    }

    @Override
    public void deleteHotel(String hotelId) {
        hotelRepository.deleteById(hotelId);
    }
}
