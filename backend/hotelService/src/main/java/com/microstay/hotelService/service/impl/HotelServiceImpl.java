package com.microstay.hotelService.service.impl;

import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;
import com.microstay.hotelService.dto.HotelCardResponse;
import com.microstay.hotelService.entity.Availability;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.Room;
import com.microstay.hotelService.repository.HotelRepository;
import com.microstay.hotelService.service.HotelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Override
    public AvailabilityResponse checkAvailability(AvailabilityRequest request) {

        Hotel hotel = getHotelDetails(request.getHotelId());
        Room room = getRoom(hotel, request.getRoomId());
        Map<LocalDate, Availability> availabilityMap = getAvailabilityMap(room);

        LocalDate date = request.getCheckInDate();

        double totalAmount = 0.0;
        double basePrice = room.getPricing().getBasePrice();
        double weekendMultiplier =
                room.getPricing().getWeekendMultiplier() != null
                        ? room.getPricing().getWeekendMultiplier()
                        : 1.0;

        while (date.isBefore(request.getCheckOutDate())) {

            Availability availability = availabilityMap.get(date);

            // If date not present, assume full availability
            if (availability == null) {
                availability = new Availability(
                        date,
                        room.getInventory().getTotalRooms()
                );
                room.getAvailability().add(availability);
                availabilityMap.put(date, availability);
            }

            if (availability.getAvailableRooms() < request.getRoomsRequired()) {
                return new AvailabilityResponse(
                        false,
                        "Rooms not available on " + date,
                        null,
                        room.getPricing().getCurrency()
                );
            }

            // Price calculation (weekend handling)
            boolean isWeekend =
                    date.getDayOfWeek().getValue() >= 6; // Sat/Sun

            double priceForDay = basePrice *
                    (isWeekend ? weekendMultiplier : 1.0);

            totalAmount += priceForDay * request.getRoomsRequired();

            date = date.plusDays(1);
        }

        // No inventory change here, but availability rows may be initialized
        hotelRepository.save(hotel);

        return new AvailabilityResponse(
                true,
                "Rooms available",
                totalAmount,
                room.getPricing().getCurrency()
        );
    }



    @Override
    public AvailabilityResponse confirmBooking(ConfirmBookingRequest request) {

        Hotel hotel = getHotelDetails(request.getHotelId());
        Room room = getRoom(hotel, request.getRoomId());
        Map<LocalDate, Availability> availabilityMap = getAvailabilityMap(room);

        LocalDate date = request.getCheckInDate();

        double totalAmount = 0.0;
        double basePrice = room.getPricing().getBasePrice();
        double weekendMultiplier =
                room.getPricing().getWeekendMultiplier() != null
                        ? room.getPricing().getWeekendMultiplier()
                        : 1.0;

        while (date.isBefore(request.getCheckOutDate())) {

            Availability availability = availabilityMap.get(date);

            if (availability == null ||
                    availability.getAvailableRooms() < request.getRoomsRequired()) {

                throw new IllegalStateException(
                        "Booking failed. Availability mismatch on " + date
                );
            }

            // Decrement inventory
            availability.setAvailableRooms(
                    availability.getAvailableRooms() - request.getRoomsRequired()
            );

            // Price calculation
            boolean isWeekend =
                    date.getDayOfWeek().getValue() >= 6;

            double priceForDay = basePrice *
                    (isWeekend ? weekendMultiplier : 1.0);

            totalAmount += priceForDay * request.getRoomsRequired();

            date = date.plusDays(1);
        }

        hotelRepository.save(hotel);

        return new AvailabilityResponse(
                true,
                "Booking confirmed",
                totalAmount,
                room.getPricing().getCurrency()
        );
    }


    @Transactional
    @Override
    public void releaseBooking(ConfirmBookingRequest request) {

        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Hotel not found"));

        Room room = hotel.getRooms().stream()
                .filter(r -> r.getRoomId().equals(request.getRoomId()))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("Room not found"));

        LocalDate currentDate = request.getCheckInDate();
        LocalDate checkOutDate = request.getCheckOutDate();

        while (currentDate.isBefore(checkOutDate)) {

            LocalDate finalCurrentDate = currentDate;
            LocalDate finalCurrentDate1 = currentDate;
            Availability availability = room.getAvailability().stream()
                    .filter(a -> a.getDate().equals(finalCurrentDate))
                    .findFirst()
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "Availability not found for date: " + finalCurrentDate1));

            availability.setAvailableRooms(
                    availability.getAvailableRooms() + request.getRoomsRequired()
            );

            currentDate = currentDate.plusDays(1);
        }

        hotelRepository.save(hotel);
    }


    // ---------------- HELPERS ----------------

    private Room getRoom(Hotel hotel, String roomId) {
        return hotel.getRooms().stream()
                .filter(r -> r.getRoomId().equals(roomId) && Boolean.TRUE.equals(r.getActive()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    private Map<LocalDate, Availability> getAvailabilityMap(Room room) {

        if (room.getAvailability() == null) {
            room.setAvailability(new ArrayList<>());
        }

        Map<LocalDate, Availability> map = new HashMap<>();

        for (Availability a : room.getAvailability()) {
            map.put(a.getDate(), a);
        }

        return map;
    }


}
