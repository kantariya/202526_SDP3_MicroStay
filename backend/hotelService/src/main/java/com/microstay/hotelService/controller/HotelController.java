package com.microstay.hotelService.controller;

import com.microstay.hotelService.dto.HotelRequestDto;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.Room;
import com.microstay.hotelService.service.HotelService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@Validated
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody @Valid HotelRequestDto dto) {
        Hotel hotel = new Hotel();
        hotel.setName(dto.getName());
        hotel.setDescription(dto.getDescription());
        hotel.setCity(dto.getCity());
        hotel.setState(dto.getState());
        hotel.setCountry(dto.getCountry());
        hotel.setLatitude(dto.getLatitude());
        hotel.setLongitude(dto.getLongitude());

        if (dto.getRooms() != null && !dto.getRooms().isEmpty()) {
            List<Room> rooms = dto.getRooms().stream().map(r -> {
                Room room = new Room();
                room.setRoomType(r.getRoomType());
                room.setPricePerNight(r.getPricePerNight());
                room.setTotalRooms(r.getTotalRooms());
                return room;
            }).toList();

            hotel.setRooms(rooms);
        }

        Hotel createdHotel = hotelService.createHotel(hotel);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdHotel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotel(
            @PathVariable @NotBlank(message = "Hotel ID cannot be blank") String id
    ) {
        Hotel hotel = hotelService.getHotel(id);
        return ResponseEntity.ok(hotel);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(
            @RequestParam @NotBlank(message = "City is required") String city,
            @RequestParam(required = false) 
            @DecimalMin(value = "0.0", message = "Rating must be at least 0")
            @DecimalMax(value = "5.0", message = "Rating must be at most 5") 
            Double rating
    ) {
        List<Hotel> hotels = hotelService.search(city, rating);
        return ResponseEntity.ok(hotels);
    }
}
