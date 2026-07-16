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
import feign.FeignException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
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
                log.info("Initiating booking process for userId={}, hotelId={}", userId, request.getHotelId());

                // 1️⃣ Validate input dates
                if (request.getCheckInDate() != null
                        && request.getCheckOutDate() != null
                        && !request.getCheckOutDate().isAfter(request.getCheckInDate())) {
                        throw new ResponseStatusException(BAD_REQUEST, "checkOutDate must be after checkInDate");
                }

                // Extract the requested room details (Assuming single room type for now)
                BookedRoomRequest requestedRoom = request.getRooms().get(0);

                // 2️⃣ Generate the unique booking reference EARLY
                String bookingReference = UUID.randomUUID().toString();

                // 3️⃣ Construct the reservation request payload
                ConfirmBookingRequest confirmRequest = new ConfirmBookingRequest();
                confirmRequest.setHotelId(request.getHotelId());
                confirmRequest.setRoomId(requestedRoom.getRoomId());
                confirmRequest.setCheckInDate(request.getCheckInDate());
                confirmRequest.setCheckOutDate(request.getCheckOutDate());
                confirmRequest.setRoomsRequired(requestedRoom.getNumberOfRooms());
                confirmRequest.setBookingId(bookingReference);

                log.debug("Attempting to atomically reserve inventory for reference={}", bookingReference);

                // 4️⃣ Execute atomic Check-and-Set and capture pricing directly from the response!

                AvailabilityResponse availability;
                try {
                        // This single network call now safely verifies, locks, updates, and fetches price.
                        availability = hotelClient.reserveRooms(request.getHotelId(), confirmRequest);
                } catch (FeignException.Conflict ex) {
                        // Catches HTTP 409 Conflict when rooms run out or @Version mismatch drops the database transaction
                        log.warn("Booking conflict detected for hotelId={}, roomId={}. Room fully booked.",
                                request.getHotelId(), requestedRoom.getRoomId());
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                "The selected room type is no longer available for these dates. Please try again.");
                } catch (Exception ex) {
                        log.error("Failed to connect or reserve rooms via hotelClient", ex);
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                                "Inventory service is currently unavailable. Please try again later.");
                }


                // 5️⃣ Create and persist booking entry safely using data returned from your inventory service
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
                        .currency(availability.getCurrency() != null ? availability.getCurrency() : "INR")
                        .totalAmount(availability.getTotalAmount() != null ? availability.getTotalAmount() : 0.0)
                        .createdAt(LocalDateTime.now())
                        .build();

                List<BookedRoom> bookedRooms = request.getRooms().stream()
                        .map(r -> mapToBookedRoom(r, booking))
                        .toList();

                booking.setRooms(bookedRooms);
                booking.setTotalRooms(
                        bookedRooms.stream()
                                .map(BookedRoom::getNumberOfRooms)
                                .filter(Objects::nonNull)
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

                log.info("Booking state persisted successfully reference={}, userId={}",
                        booking.getBookingReference(), userId);

                return BookingResponse.builder()
                        .bookingId(booking.getBookingId())
                        .bookingReference(booking.getBookingReference())
                        .status(booking.getStatus())
                        .totalAmount(booking.getTotalAmount())
                        .currency(booking.getCurrency())
                        .build();
        }


        public void confirmBooking(String bookingReference) {
                log.debug("Confirming booking bookingReference={}", bookingReference);
                Booking booking = getBooking(bookingReference);
                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setUpdatedAt(LocalDateTime.now());
        }

        @Transactional
        public void cancelBooking(String bookingReference,String userId,String userRole) {

                log.info("Cancelling booking bookingReference={} requestedByUserId={} role={}",
                                bookingReference,
                                userId,
                                userRole);

                Booking booking = getBooking(bookingReference);

                if(!booking.getUserId().equals(userId) && !"ADMIN".equalsIgnoreCase(userRole)) {
                        throw new ResponseStatusException(BAD_REQUEST, "You can only cancel your own bookings");
                }

                // ✅ prevent double cancel
                if (booking.getStatus().equals(BookingStatus.CANCELLED)) {
                        log.info("Booking already cancelled bookingReference={}", bookingReference);
                        return;
                }

                // ✅ only allow cancel before check-in date
                LocalDate today = LocalDate.now();

                if (!booking.getCheckInDate().isAfter(today)) {
                        log.warn("Rejecting late cancellation bookingReference={}, checkInDate={}, today={}",
                                        bookingReference,
                                        booking.getCheckInDate(),
                                        today);
                        throw new RuntimeException(
                                        "Cannot cancel booking after or on check-in date");
                }

                // ✅ release ALL rooms in booking
                for (BookedRoom bookedRoom : booking.getRooms()) {

                        ConfirmBookingRequest releaseRequest = new ConfirmBookingRequest();

                        releaseRequest.setHotelId(booking.getHotelId());
                        releaseRequest.setRoomId(bookedRoom.getRoomId());
                        releaseRequest.setCheckInDate(booking.getCheckInDate());
                        releaseRequest.setCheckOutDate(booking.getCheckOutDate());
                        releaseRequest.setRoomsRequired(bookedRoom.getNumberOfRooms());
                        releaseRequest.setBookingId(booking.getBookingReference());

                        log.debug("Releasing room during cancel bookingReference={}, roomId={}, roomsRequired={}",
                                        booking.getBookingReference(),
                                        bookedRoom.getRoomId(),
                                        bookedRoom.getNumberOfRooms());

                        // call hotel service to increase inventory with resilience
                        releaseRooms(booking.getHotelId(), releaseRequest);
                }

                // ✅ update booking status
                booking.setStatus(BookingStatus.CANCELLED);
                booking.setUpdatedAt(LocalDateTime.now());

                bookingRepository.save(booking);

                log.info("Booking cancelled successfully bookingReference={}", bookingReference);
        }

        public Booking getBooking(String bookingReference) {
                log.debug("Fetching booking by bookingReference={}", bookingReference);
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

                log.warn("Releasing booking after payment failure bookingId={}", bookingId);

                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new RuntimeException("Booking not found"));

                // ✅ prevent double release
                if (booking.getStatus() != BookingStatus.INITIATED) {
                        log.debug("Skipping release after payment failure because booking status is {} for bookingId={}",
                                        booking.getStatus(),
                                        bookingId);
                        return;
                }

                for (BookedRoom room : booking.getRooms()) {

                        log.debug("Releasing room after payment failure bookingReference={}, roomId={}, roomsRequired={}",
                                        booking.getBookingReference(),
                                        room.getRoomId(),
                                        room.getNumberOfRooms());

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
                log.info("Booking marked failed after payment issue bookingId={}, bookingReference={}",
                                bookingId,
                                booking.getBookingReference());
        }

        @Transactional
        public void markPaymentSuccess(Long bookingId) {

                log.info("markPaymentSuccess called for bookingId={}", bookingId);

                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow();

                log.debug("Loaded booking for payment success bookingId={}, bookingReference={}, status={}",
                                bookingId,
                                booking.getBookingReference(),
                                booking.getStatus());

                if (booking.getStatus() != BookingStatus.INITIATED) {
                        log.debug("Skipping payment success update because booking status is {} for bookingId={}",
                                        booking.getStatus(),
                                        bookingId);
                        return;
                }

                booking.setStatus(BookingStatus.CONFIRMED);
                booking.setUpdatedAt(LocalDateTime.now());

                bookingRepository.save(booking);
                log.info("Booking marked confirmed after payment bookingId={}, bookingReference={}",
                                bookingId,
                                booking.getBookingReference());
        }

        public UserBookingsResponse getBookingsForUser(String userId) {

                log.debug("Fetching bookings for userId={}", userId);

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

                log.debug("User booking summary userId={}, total={}, upcoming={}, past={}",
                                userId,
                                bookings.size(),
                                upcoming,
                                past);

                return UserBookingsResponse.builder()
                                .bookings(bookings)
                                .upcomingCount(upcoming)
                                .pastCount(past)
                                .build();
        }

        public List<Booking> getBookingsForManager(String managerId) {
                // Securely fetch hotels owned by this manager
                log.debug("Fetching bookings for managerId={}", managerId);
                List<com.microstay.bookingService.dto.HotelResponse> hotels = hotelClient.getMyHotels(managerId);

                List<String> hotelIds = hotels.stream()
                                .map(com.microstay.bookingService.dto.HotelResponse::getId)
                                .toList();

                if (hotelIds.isEmpty()) {
                        log.info("No hotels found for managerId={}", managerId);
                        return List.of();
                }

                List<Booking> bookings = bookingRepository.findByHotelIdIn(hotelIds);
                log.debug("Found {} bookings for managerId={} across {} hotels", bookings.size(), managerId, hotelIds.size());
                return bookings;
        }

        public List<Booking> getAllBookings(String status, String hotelId) {
                log.debug("Fetching all bookings with status={} hotelId={}", status, hotelId);
                Booking probe = new Booking();
                if (status != null && !status.isBlank()) {
                        try {
                                probe.setStatus(BookingStatus.valueOf(status.toUpperCase()));
                        } catch (IllegalArgumentException e) {
                                log.warn("Ignoring invalid booking status filter status={}", status);
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

                List<Booking> bookings = bookingRepository.findAll(org.springframework.data.domain.Example.of(probe, matcher));
                log.debug("Found {} bookings for filters status={} hotelId={}", bookings.size(), status, hotelId);
                return bookings;
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
                log.debug("Releasing rooms through hotel service hotelId={}, roomId={}, bookingId={}",
                                hotelId,
                                releaseRequest.getRoomId(),
                                releaseRequest.getBookingId());
                hotelClient.releaseRooms(hotelId, releaseRequest);
        }

}
