package com.microstay.bookingService.service;

import com.microstay.bookingService.client.HotelServiceClient;
import com.microstay.bookingService.dto.BookedRoomRequest;
import com.microstay.bookingService.dto.BookingResponse;
import com.microstay.bookingService.dto.InitiateBookingRequest;
import com.microstay.bookingService.entity.*;
import com.microstay.bookingService.mapper.AvailabilityRequestMapper;
import com.microstay.bookingService.repository.BookingRepository;
import com.microstay.bookingService.repository.PaymentRepository;
import com.microstay.contract.hotelContract.dto.AvailabilityRequest;
import com.microstay.contract.hotelContract.dto.AvailabilityResponse;
import com.microstay.contract.hotelContract.dto.ConfirmBookingRequest;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final HotelServiceClient hotelClient;

    public BookingResponse initiateBooking(
            InitiateBookingRequest request,
            String userId
    ) {

        // Assume single room type for now
        BookedRoomRequest room = request.getRooms().get(0);

        // 1️⃣ Build availability request
        AvailabilityRequest availabilityRequest =
                AvailabilityRequestMapper.fromInitiateRequest(
                        request,
                        room.getRoomId(),
                        room.getNumberOfRooms()
                );

        // 2️⃣ Check availability
        AvailabilityResponse availability =
                hotelClient.checkAvailability(
                        request.getHotelId(),
                        availabilityRequest
                );

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
                confirmRequest
        );

        // 6️⃣ Create booking entity
        Booking booking = Booking.builder()
                .bookingReference(bookingReference)
                .userId(userId)
                .hotelId(request.getHotelId())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .guestDetails(request.getGuestDetails())
                .status(BookingStatus.INITIATED)
                .currency(
                        availability.getCurrency() != null
                                ? availability.getCurrency()
                                : "INR"
                )
                .totalAmount(
                        availability.getTotalAmount() != null
                                ? availability.getTotalAmount()
                                : 0.0
                )
                .createdAt(LocalDateTime.now())
                .build();

        List<BookedRoom> bookedRooms = request.getRooms().stream()
                .map(r -> mapToBookedRoom(r, booking))
                .toList();

        booking.setRooms(bookedRooms);

        bookingRepository.save(booking);

        // 7️⃣ Create payment record
        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalAmount())
                .currency(booking.getCurrency())
                .status(PaymentStatus.CREATED)
                .build();

        paymentRepository.save(payment);

        return BookingResponse.builder()
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

    public void cancelBooking(String bookingReference) {
        Booking booking = getBooking(bookingReference);

        BookedRoom bookedRoom = booking.getRooms().get(0);

        ConfirmBookingRequest releaseRequest = new ConfirmBookingRequest();
        releaseRequest.setHotelId(booking.getHotelId());
        releaseRequest.setRoomId(bookedRoom.getRoomId());
        releaseRequest.setCheckInDate(booking.getCheckInDate());
        releaseRequest.setCheckOutDate(booking.getCheckOutDate());
        releaseRequest.setRoomsRequired(bookedRoom.getNumberOfRooms());
        releaseRequest.setBookingId(booking.getBookingReference());

        hotelClient.releaseRooms(
                booking.getHotelId(),
                releaseRequest
        );

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
    }

    public Booking getBooking(String bookingReference) {
        return bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() ->
                        new EntityNotFoundException("Booking not found"));
    }

    private BookedRoom mapToBookedRoom(
            BookedRoomRequest request,
            Booking booking
    ) {
        return BookedRoom.builder()
                .roomId(request.getRoomId())
                .numberOfRooms(request.getNumberOfRooms())
                .adults(request.getAdults())
                .children(request.getChildren())
                .booking(booking)
                .build();
    }
}
