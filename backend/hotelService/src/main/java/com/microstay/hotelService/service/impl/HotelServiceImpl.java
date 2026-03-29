package com.microstay.hotelService.service.impl;

import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;
import com.microstay.hotelService.dto.HotelCardResponse;
import com.microstay.hotelService.entity.*;
import com.microstay.hotelService.repository.HotelRepository;
import com.microstay.hotelService.service.HotelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public Page<Hotel> searchHotels(
            String city,
            LocalDate checkIn,
            LocalDate checkOut,
            Double minPrice,
            Double maxPrice,
            Integer starRating,
            RoomType roomType,
            List<String> facilities,
            int page,
            int size,
            String sortDirection
    ) {

        if (checkIn == null) {
            checkIn = LocalDate.now();
        }

        if (checkOut == null) {
            checkOut = checkIn.plusDays(1);
        }

        if (city == null) {
            city = "Delhi";
        }

        Pageable pageable = PageRequest.of(page, size);

        System.out.println("Search params - city: " + city + ", checkIn: " + checkIn + ", checkOut: " + checkOut +
                ", minPrice: " + minPrice + ", maxPrice: " + maxPrice +
                ", starRating: " + starRating + ", roomType: " + roomType +
                ", facilities: " + facilities +
                ", page: " + page + ", size: " + size +
                ", sortDirection: " + sortDirection);

        return hotelRepository.searchHotels(
                city,
                checkIn,
                checkOut,
                minPrice,
                maxPrice,
                starRating,
                roomType,
                facilities,
                pageable,
                sortDirection
        );
    }

    @Override
    public List<HotelCardResponse> getHotelCards(String city) {
        // Public search: Filter by ACTIVE only
        // Strictly enforce status = ACTIVE
        List<Hotel> hotels;
        if (city != null && !city.isBlank()) {
            hotels = hotelRepository.findByLocationCityContainingIgnoreCaseAndStatus(city, HotelStatus.ACTIVE);
        } else {
            hotels = hotelRepository.findByStatus(HotelStatus.ACTIVE);
        }

        return hotels.stream()
                .map(h -> new HotelCardResponse(
                        h.getId(),
                        h.getName(),
                        h.getLocation().getCity(),
                        h.getLocation().getCity(),
                        h.getStarRating(),
                        h.getRatingSummary() != null 
                            ? new HotelCardResponse.RatingSummary(h.getRatingSummary().getAverage(), h.getRatingSummary().getTotalReviews()) 
                            : new HotelCardResponse.RatingSummary(0.0, 0),
                        h.getRooms().stream()
                                .map(r -> r.getPricing().getBasePrice())
                                .min(Double::compareTo)
                                .orElse(0.0),
                        h.getImages().isEmpty() ? null : h.getImages().get(0)))
                .toList();
    }

    @Override
    public List<Hotel> getAllHotels(String city, HotelStatus status, String managerId) {
        // Dynamic admin filter using ExampleMatcher
        Hotel probe = new Hotel();
        if (status != null)
            probe.setStatus(status);
        if (managerId != null)
            probe.setManagerId(managerId);

        if (city != null && !city.isBlank()) {
            Hotel.Location loc = new Hotel.Location();
            loc.setCity(city);
            probe.setLocation(loc);
        }

        org.springframework.data.domain.ExampleMatcher matcher = org.springframework.data.domain.ExampleMatcher
                .matching()
                .withIgnoreNullValues()
                .withMatcher("status", match -> match.exact())
                .withMatcher("managerId", match -> match.exact())
                .withMatcher("location.city", match -> match.contains().ignoreCase());

        return hotelRepository.findAll(org.springframework.data.domain.Example.of(probe, matcher));
    }

    @Override
    public HotelCardResponse getHotelCardById(String hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        return new HotelCardResponse(
                hotel.getId(),
                hotel.getName(),
                hotel.getLocation().getCity(),
                hotel.getLocation().getCountry(),
                hotel.getStarRating(),
                hotel.getRatingSummary() != null 
                    ? new HotelCardResponse.RatingSummary(hotel.getRatingSummary().getAverage(), hotel.getRatingSummary().getTotalReviews()) 
                    : new HotelCardResponse.RatingSummary(0.0, 0),
                hotel.getRooms().stream()
                        .map(r -> r.getPricing().getBasePrice())
                        .min(Double::compareTo)
                        .orElse(0.0),
                hotel.getImages().isEmpty() ? null : hotel.getImages().get(0));
    }

    @Override
    public List<Hotel> getHotelsByManagerId(String managerId) {
        return hotelRepository.findByManagerId(managerId);
    }

    @Override
    public List<Hotel> getHotelsByStatus(HotelStatus status) {
        return hotelRepository.findByStatus(status);
    }

    @Override
    public Hotel updateHotelStatus(String hotelId, HotelStatus status) {
        Hotel hotel = getHotelDetails(hotelId, true);
        hotel.setStatus(status);
        hotel.setUpdatedAt(Instant.now());
        return hotelRepository.save(hotel);
    }

    @Override
    public Hotel getHotelDetails(String hotelId, boolean includeInactiveRooms) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        if (!includeInactiveRooms && hotel.getRooms() != null) {
            // Filter inactive rooms
            List<Room> activeRooms = hotel.getRooms().stream()
                    .filter(r -> Boolean.TRUE.equals(r.getActive()))
                    .toList();
            hotel.setRooms(activeRooms);
        }

        return hotel;
    }

    @Override
    @Transactional
    public Hotel createHotel(Hotel hotel, String role, String userId) {
        hotel.setCreatedAt(Instant.now());
        hotel.setUpdatedAt(Instant.now());
        hotel.setManagerId(userId);

        if ("ADMIN".equals(role)) {
            hotel.setStatus(HotelStatus.ACTIVE);
        } else {
            hotel.setStatus(HotelStatus.PENDING);
        }

        return hotelRepository.save(hotel);
    }

    @Override
    @Transactional
    public Hotel updateHotel(String hotelId, Hotel hotel) {
        Hotel existing = getHotelDetails(hotelId, true);

        // Note: Ownership check should ideally be here if we pass userId/role to this
        // method
        // But Controller can also handle it / pass context.
        // For now, we assume Controller might validate or we update signature.

        hotel.setId(existing.getId());
        hotel.setCreatedAt(existing.getCreatedAt());
        hotel.setUpdatedAt(Instant.now());

        // Maintain critical fields if not provided
        if (hotel.getStatus() == null)
            hotel.setStatus(existing.getStatus());
        if (hotel.getManagerId() == null)
            hotel.setManagerId(existing.getManagerId());

        return hotelRepository.save(hotel);
    }

    @Override
    @Transactional
    public void deleteHotel(String hotelId) {
        hotelRepository.deleteById(hotelId);
    }

    @Override
    public AvailabilityResponse checkAvailability(AvailabilityRequest request) {

        Hotel hotel = getHotelDetails(request.getHotelId(), true);
        Room room = getRoom(hotel, request.getRoomId());
        Map<LocalDate, Availability> availabilityMap = getAvailabilityMap(room);

        LocalDate date = request.getCheckInDate();

        double totalAmount = 0.0;
        double basePrice = room.getPricing().getBasePrice();
        double weekendMultiplier = room.getPricing().getWeekendMultiplier() != null
                ? room.getPricing().getWeekendMultiplier()
                : 1.0;

        while (date.isBefore(request.getCheckOutDate())) {

            Availability availability = availabilityMap.get(date);

            System.out.println("Checking availability for date: " + availability + " with date: " + date);

            // If date not present, assume full availability
            if (availability == null) {
                availability = new Availability(
                        date,
                        room.getInventory().getTotalRooms());
                room.getAvailability().add(availability);
                availabilityMap.put(date, availability);
            }

            if (availability.getAvailableRooms() < request.getRoomsRequired()) {
                System.out.println("Not enough rooms for date " + date + ": required " + request.getRoomsRequired() +
                        ", available " + availability.getAvailableRooms());
                return new AvailabilityResponse(
                        false,
                        "Rooms not available on " + date,
                        null,
                        room.getPricing().getCurrency());
            }

            // Price calculation (weekend handling)
            boolean isWeekend = date.getDayOfWeek().getValue() >= 6; // Sat/Sun

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
                room.getPricing().getCurrency());
    }

    @Override
    @Transactional
    public AvailabilityResponse confirmBooking(ConfirmBookingRequest request) {

        Hotel hotel = getHotelDetails(request.getHotelId(), true);
        Room room = getRoom(hotel, request.getRoomId());
        Map<LocalDate, Availability> availabilityMap = getAvailabilityMap(room);

        LocalDate date = request.getCheckInDate();

        double totalAmount = 0.0;
        double basePrice = room.getPricing().getBasePrice();
        double weekendMultiplier = room.getPricing().getWeekendMultiplier() != null
                ? room.getPricing().getWeekendMultiplier()
                : 1.0;

        while (date.isBefore(request.getCheckOutDate())) {

            Availability availability = availabilityMap.get(date);

            System.out.println("availablity : " + availability);
            System.out.println("request :" + request);

            if (availability == null ||
                    availability.getAvailableRooms() < request.getRoomsRequired()) {

                throw new IllegalStateException(
                        "Booking failed. Availability mismatch on " + date);
            }

            // Decrement inventory
            availability.setAvailableRooms(
                    availability.getAvailableRooms() - request.getRoomsRequired());

            System.out.println("Updated availability for date " + date + ": " + availability);

            // Price calculation
            boolean isWeekend = date.getDayOfWeek().getValue() >= 6;

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
                room.getPricing().getCurrency());
    }

    @Transactional
    @Override
    public void releaseBooking(ConfirmBookingRequest request) {

        log.info("Release booking {}", request);

        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new IllegalArgumentException("Hotel not found"));

        Room room = hotel.getRooms().stream()
                .filter(r -> r.getRoomId().equals(request.getRoomId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        Map<LocalDate, Availability> availabilityMap = getAvailabilityMap(room);

        LocalDate date = request.getCheckInDate();

        while (date.isBefore(request.getCheckOutDate())) {

            Availability availability = availabilityMap.get(date);

            // ✅ FIX — create if missing
            if (availability == null) {
                availability = new Availability(
                        date,
                        room.getInventory().getTotalRooms());
                room.getAvailability().add(availability);
                availabilityMap.put(date, availability);

                log.warn("Created missing availability row for {}", date);
            }

            int newVal = availability.getAvailableRooms()
                    + request.getRoomsRequired();

            // ✅ double-release guard
            if (newVal > room.getInventory().getTotalRooms()) {
                log.warn("Release overflow prevented for {}", date);
                newVal = room.getInventory().getTotalRooms();
            }

            availability.setAvailableRooms(newVal);

            log.info("Released {} rooms for {} → now {}",
                    request.getRoomsRequired(),
                    date,
                    newVal);

            date = date.plusDays(1);
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
            System.out.println("Availability: " + a);
            map.put(a.getDate(), a);
        }

        return map;
    }

}
