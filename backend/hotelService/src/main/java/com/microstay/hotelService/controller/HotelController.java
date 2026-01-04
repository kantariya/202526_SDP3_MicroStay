package com.microstay.hotelService.controller;

import com.microstay.hotelService.dto.HotelRequestDto;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.Room;
import com.microstay.hotelService.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    public Hotel createHotel(@RequestBody @Valid HotelRequestDto dto) {

        Hotel hotel = new Hotel();
        hotel.setName(dto.getName());
        hotel.setDescription(dto.getDescription());
        hotel.setCity(dto.getCity());
        hotel.setState(dto.getState());
        hotel.setCountry(dto.getCountry());
        hotel.setLatitude(dto.getLatitude());
        hotel.setLongitude(dto.getLongitude());

        if (dto.getRooms() != null) {
            List<Room> rooms = dto.getRooms().stream().map(r -> {
                Room room = new Room();
                room.setRoomType(r.getRoomType());
                room.setPricePerNight(r.getPricePerNight());
                room.setTotalRooms(r.getTotalRooms());
                return room;
            }).toList();

            hotel.setRooms(rooms);
        }

        return hotelService.createHotel(hotel);
    }

    @GetMapping("/{id}")
    public Hotel get(@PathVariable String id) {
        return hotelService.getHotel(id);
    }

    @GetMapping("/search")
    public List<Hotel> search(
            @RequestParam String city,
            @RequestParam(required = false) Double rating
    ) {
        return hotelService.search(city, rating);
    }
}
