package com.microstay.hotelService.controller;

import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;
import com.microstay.hotelService.dto.HotelCardResponse;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.HotelStatus;
import com.microstay.hotelService.entity.RoomType;
import com.microstay.hotelService.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;


    @GetMapping("/search")
    public Page<Hotel> searchHotels(

            @RequestParam(required = false) String city,
            @RequestParam(required = false) LocalDate checkIn,
            @RequestParam(required = false) LocalDate checkOut,

            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,

            @RequestParam(required = false) Integer starRating,
            @RequestParam(required = false) RoomType roomType,
            @RequestParam(required = false) List<String> facilities,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,

            @RequestParam(defaultValue = "") String sortDirection
    ) {

        return hotelService.searchHotels(
                city,
                checkIn,
                checkOut,
                minPrice,
                maxPrice,
                starRating,
                roomType,
                facilities,
                page,
                size,
                sortDirection
        );
    }

    // 1️⃣ Dashboard – minimal hotel cards
    @GetMapping
    public List<HotelCardResponse> getHotels(
            @RequestParam(required = false) String city) {
        return hotelService.getHotelCards(city);
    }



    @GetMapping("/{hotelId}/card")
    public HotelCardResponse getHotelCard(@PathVariable String hotelId) {
        return hotelService.getHotelCardById(hotelId);
    }

    // 2️⃣ Hotel details page
    @GetMapping("/{hotelId}")
    public Hotel getHotelDetails(@PathVariable String hotelId) {
        return hotelService.getHotelDetails(hotelId, false);
    }

    // 3️⃣ Create hotel (ADMIN / HOTEL_MANAGER)
    @PostMapping
    public Hotel createHotel(
            @RequestBody Hotel hotel,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return hotelService.createHotel(hotel, role, userId);
    }

    // --- Admin Approval Flow ---

    @GetMapping("/pending")
    public List<Hotel> getPendingHotels() {
        return hotelService.getHotelsByStatus(HotelStatus.PENDING);
    }

    @PutMapping("/{id}/approve")
    public Hotel approveHotel(@PathVariable String id) {
        return hotelService.updateHotelStatus(id, HotelStatus.ACTIVE);
    }

    @PutMapping("/{id}/reject")
    public Hotel rejectHotel(@PathVariable String id) {
        return hotelService.updateHotelStatus(id, HotelStatus.INACTIVE);
    }

    // 4️⃣ Update hotel details
    @PutMapping("/{hotelId}")
    public Hotel updateHotel(
            @PathVariable String hotelId,
            @RequestBody Hotel hotel,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        // Ownership Check
        if (!"ADMIN".equals(role)) {
            Hotel existing = hotelService.getHotelDetails(hotelId, true);
            if (!existing.getManagerId().equals(userId)) {
                throw new RuntimeException("Access Denied: You do not own this hotel.");
            }
        }

        return hotelService.updateHotel(hotelId, hotel);
    }

    // 5️⃣ Delete hotel (ADMIN only or Manager owns?)
    // Usually Delete is Admin only as per previous file comments, but if Manager
    // can delete:
    @DeleteMapping("/{hotelId}")
    public void deleteHotel(
            @PathVariable String hotelId,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        if (!"ADMIN".equals(role)) {
            Hotel existing = hotelService.getHotelDetails(hotelId, true);
            if (!existing.getManagerId().equals(userId)) {
                throw new RuntimeException("Access Denied");
            }
        }
        hotelService.deleteHotel(hotelId);
    }

    // --- Manager Specific ---

    @GetMapping("/manager/my-hotels")
    public List<Hotel> getMyHotels(
            @RequestHeader(value = "X-User-Id") String userId) {
        return hotelService.getHotelsByManagerId(userId);
    }

    @PostMapping("/check-availability")
    public AvailabilityResponse checkAvailability(
            @RequestBody AvailabilityRequest request) {

        return hotelService.checkAvailability(request);
    }

    @PostMapping("/confirm-booking")
    public AvailabilityResponse confirmBooking(
            @RequestBody ConfirmBookingRequest request) {

        return hotelService.confirmBooking(request);
    }
}
