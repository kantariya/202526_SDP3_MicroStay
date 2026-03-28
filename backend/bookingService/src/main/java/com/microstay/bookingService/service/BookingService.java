package com.microstay.bookingService.service;

import com.microstay.bookingService.client.HotelServiceClient;
import com.microstay.bookingService.dto.BookedRoomRequest;
import com.microstay.bookingService.dto.BookingResponse;
import com.microstay.bookingService.dto.InitiateBookingRequest;
import com.microstay.bookingService.dto.UserBookingsResponse;
import com.microstay.bookingService.entity.*;
import com.microstay.bookingService.mapper.AvailabilityRequestMapper;
import com.microstay.bookingService.repository.BookingRepository;
import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;
import com.microstay.contract.hotelContract.dto.RoomType;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BookingService {

        private final BookingRepository bookingRepository;
        private final HotelServiceClient hotelClient;

        public BookingResponse initiateBooking(
                        InitiateBookingRequest request,
                        String userId) {
                if (request.getCheckInDate() != null
                                && request.getCheckOutDate() != null
                                && !request.getCheckOutDate().isAfter(request.getCheckInDate())) {
                        throw new ResponseStatusException(BAD_REQUEST, "checkOutDate must be after checkInDate");
                }

                // Assume single room type for now
                BookedRoomRequest room = request.getRooms().get(0);

                // 1️⃣ Build availability request
                AvailabilityRequest availabilityRequest = AvailabilityRequestMapper.fromInitiateRequest(
                                request,
                                room.getRoomId(),
                                room.getNumberOfRooms());

                // 2️⃣ Check availability
                AvailabilityResponse availability = hotelClient.checkAvailability(
                                request.getHotelId(),
                                availabilityRequest);

                System.out.println("Availability response: " + availability);

                if (!availability.isAvailable()) {
                        throw new IllegalStateException(availability.getMessage());
                }

                // 3️⃣ Generate booking reference EARLY (important)
                String bookingReference = UUID.randomUUID().toString();

                // 4️⃣ Build confirm booking request
                ConfirmBookingRequest confirmRequest = new ConfirmBookingRequest();
                confirmRequest.setHotelId(request.getHotelId());
                confirmRequest.setRoomId(room.getRoomId());
                confirmRequest.setCheckInDate(request.getCheckInDate());
                confirmRequest.setCheckOutDate(request.getCheckOutDate());
                confirmRequest.setRoomsRequired(room.getNumberOfRooms());
                confirmRequest.setBookingId(bookingReference);

                // 5️⃣ Reserve rooms (inventory decrement)
                hotelClient.reserveRooms(
                                request.getHotelId(),
                                confirmRequest);

                // 6️⃣ Create booking entity
                Booking booking = Booking.builder()
                                .bookingReference(bookingReference)
                                .userId(userId)
                                .hotelId(request.getHotelId())
                                .hotelName(
                                                request.getHotelName() != null && !request.getHotelName().isBlank()
                                                                ? request.getHotelName()
                                                                : "UNKNOWN")
                                .checkInDate(request.getCheckInDate())
                                .checkOutDate(request.getCheckOutDate())
                                .guestDetails(maskAadharNumbers(request.getGuestDetails()))
                                .status(BookingStatus.INITIATED)
                                .currency(
                                                availability.getCurrency() != null
                                                                ? availability.getCurrency()
                                                                : "INR")
                                .totalAmount(
                                                availability.getTotalAmount() != null
                                                                ? availability.getTotalAmount()
                                                                : 0.0)
                                .createdAt(LocalDateTime.now())
                                .build();

                List<BookedRoom> bookedRooms = request.getRooms().stream()
                                .map(r -> mapToBookedRoom(r, booking))
                                .toList();

                booking.setRooms(bookedRooms);
                booking.setTotalRooms(
                                bookedRooms.stream()
                                                .map(BookedRoom::getNumberOfRooms)
                                                .filter(n -> n != null)
                                                .mapToInt(Integer::intValue)
                                                .sum());
                booking.setTotalGuests(
                                bookedRooms.stream()
                                                .mapToInt(r -> {
                                                        int adults = r.getAdults() != null ? r.getAdults() : 0;
                                                        int children = r.getChildren() != null ? r.getChildren() : 0;
                                                        int rooms = r.getNumberOfRooms() != null ? r.getNumberOfRooms()
                                                                        : 0;
                                                        return (adults + children) * rooms;
                                                })
                                                .sum());
                booking.setPaymentDueTime(LocalDateTime.now().plusMinutes(15));

                bookingRepository.save(booking);

                return BookingResponse.builder()
                                .bookingId(booking.getBookingId())
                                .bookingReference(booking.getBookingReference())
                                .status(booking.getStatus())
                                .totalAmount(booking.getTotalAmount())
                                .currency(booking.getCurrency())
                                .build();
        }

        public void confirmBooking(String bookingReference) {
                Booking booking = getBooking(bookingReference);
                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setUpdatedAt(LocalDateTime.now());
        }

        @Transactional
        public void cancelBooking(String bookingReference,String userId,String userRole) {

                Booking booking = getBooking(bookingReference);

                if(!booking.getUserId().equals(userId) && !"ADMIN".equalsIgnoreCase(userRole)) {
                        throw new ResponseStatusException(BAD_REQUEST, "You can only cancel your own bookings");
                }

                // ✅ prevent double cancel
                if (booking.getStatus().equals(BookingStatus.CANCELLED)) {
                        log.info("Booking already cancelled {}", bookingReference);
                        return;
                }

                // ✅ only allow cancel before check-in date
                LocalDate today = LocalDate.now();

                if (!booking.getCheckInDate().isAfter(today)) {
                        throw new RuntimeException(
                                        "Cannot cancel booking after or on check-in date");
                }

                log.info("Cancelling booking {}", bookingReference);

                // ✅ release ALL rooms in booking
                for (BookedRoom bookedRoom : booking.getRooms()) {

                        ConfirmBookingRequest releaseRequest = new ConfirmBookingRequest();

                        releaseRequest.setHotelId(booking.getHotelId());
                        releaseRequest.setRoomId(bookedRoom.getRoomId());
                        releaseRequest.setCheckInDate(booking.getCheckInDate());
                        releaseRequest.setCheckOutDate(booking.getCheckOutDate());
                        releaseRequest.setRoomsRequired(bookedRoom.getNumberOfRooms());
                        releaseRequest.setBookingId(booking.getBookingReference());

                        log.info("Releasing room {} count {}",
                                        bookedRoom.getRoomId(),
                                        bookedRoom.getNumberOfRooms());

                        // call hotel service to increase inventory with resilience
                        releaseRooms(booking.getHotelId(), releaseRequest);
                }

                // ✅ update booking status
                booking.setStatus(BookingStatus.CANCELLED);
                booking.setUpdatedAt(LocalDateTime.now());

                bookingRepository.save(booking);

                log.info("Booking cancelled successfully {}", bookingReference);
        }

        public Booking getBooking(String bookingReference) {
                return bookingRepository.findByBookingReference(bookingReference)
                                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));
        }

        private BookedRoom mapToBookedRoom(
                        BookedRoomRequest request,
                        Booking booking) {
                return BookedRoom.builder()
                                .roomId(request.getRoomId())
                                .roomType(
                                                request.getRoomType() != null
                                                                ? request.getRoomType()
                                                                : RoomType.STANDARD)
                                .numberOfRooms(request.getNumberOfRooms())
                                .adults(request.getAdults())
                                .children(request.getChildren())
                                .pricePerNight(request.getPricePerNight() != null ? request.getPricePerNight() : 0.0)
                                .booking(booking)
                                .build();
        }

        @Transactional
        public void releaseAfterPaymentFailure(Long bookingId) {

                System.out.println("Releasing booking with ID " + bookingId + " due to payment failure");

                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                // ✅ prevent double release
                if (booking.getStatus() != BookingStatus.INITIATED) {
                        return;
                }

                for (BookedRoom room : booking.getRooms()) {

                        System.out.println("Releasing booking " + booking.getBookingReference() + " for room "
                                        + room.getRoomId() + " due to payment failure");

                        ConfirmBookingRequest req = new ConfirmBookingRequest(
                                        booking.getHotelId(),
                                        room.getRoomId(),
                                        booking.getCheckInDate(),
                                        booking.getCheckOutDate(),
                                        room.getNumberOfRooms(),
                                        booking.getBookingReference());

                        hotelClient.releaseBooking(req);
                }

                booking.setStatus(BookingStatus.FAILED);
                booking.setUpdatedAt(LocalDateTime.now());

                bookingRepository.save(booking);
        }

        @Transactional
        public void markPaymentSuccess(Long bookingId) {

                log.info("markPaymentSuccess called for {}", bookingId);

                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow();

                System.out.println(booking);

                if (booking.getStatus() != BookingStatus.INITIATED) {
                        return;
                }

                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setUpdatedAt(LocalDateTime.now());

                bookingRepository.save(booking);
        }

        public UserBookingsResponse getBookingsForUser(String userId) {

                List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);

                LocalDate today = LocalDate.now();

                long upcoming = bookings.stream()
                                .filter(b -> !b.getStatus().equals(BookingStatus.CANCELLED)
                                                && !b.getStatus().equals(BookingStatus.FAILED))
                                .filter(b -> b.getCheckInDate().isAfter(today) || b.getCheckInDate().equals(today))
                                .count();

                long past = bookings.stream()
                                .filter(b -> b.getCheckOutDate().isBefore(today))
                                .count();

                return UserBookingsResponse.builder()
                                .bookings(bookings)
                                .upcomingCount(upcoming)
                                .pastCount(past)
                                .build();
        }

        public List<Booking> getBookingsForManager(String managerId) {
                // Securely fetch hotels owned by this manager
                List<com.microstay.bookingService.dto.HotelResponse> hotels = hotelClient.getMyHotels(managerId);

                List<String> hotelIds = hotels.stream()
                                .map(com.microstay.bookingService.dto.HotelResponse::getId)
                                .toList();

                if (hotelIds.isEmpty()) {
                        return List.of();
                }

                return bookingRepository.findByHotelIdIn(hotelIds);
        }

        public List<Booking> getAllBookings(String status, String hotelId) {
                Booking probe = new Booking();
                if (status != null && !status.isBlank()) {
                        try {
                                probe.setStatus(BookingStatus.valueOf(status.toUpperCase()));
                        } catch (IllegalArgumentException e) {
                        }
                }
                if (hotelId != null && !hotelId.isBlank()) {
                        probe.setHotelId(hotelId);
                }

                org.springframework.data.domain.ExampleMatcher matcher = org.springframework.data.domain.ExampleMatcher
                                .matching()
                                .withIgnoreNullValues()
                                .withMatcher("hotelId", match -> match.exact())
                                .withMatcher("status", match -> match.exact());

                return bookingRepository.findAll(org.springframework.data.domain.Example.of(probe, matcher));
        }

        /**
         * Masks Aadhar numbers in guest details, keeping only the last 4 digits
         * Format: ****XXXX where XXXX are the last 4 digits
         */
        private List<GuestDetails> maskAadharNumbers(List<GuestDetails> guestDetails) {
                return guestDetails.stream()
                                .map(guest -> {
                                        if (guest.getAadharNumber() != null && guest.getAadharNumber().length() >= 4) {
                                                String maskedAadhar = "****" + guest.getAadharNumber().substring(guest.getAadharNumber().length() - 4);
                                                guest.setAadharNumber(maskedAadhar);
                                        }
                                        return guest;
                                })
                                .toList();
        }

        private void releaseRooms(String hotelId, ConfirmBookingRequest releaseRequest) {
                hotelClient.releaseRooms(hotelId, releaseRequest);
        }

}
