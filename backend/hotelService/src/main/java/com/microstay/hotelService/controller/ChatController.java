package com.microstay.hotelService.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.microstay.hotelService.dto.HotelSearchFilter;
import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.service.AiFilterParser;
import com.microstay.hotelService.service.HotelSearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AiFilterParser aiFilterParser;
    private final HotelSearchService hotelSearchService;

    @PostMapping("/search")
    public Object searchHotels(@RequestBody String message) {

        HotelSearchFilter filter = aiFilterParser.parseFilters(message);

        List<Hotel> hotels = hotelSearchService.searchWithFilter(filter);

        if (hotels.isEmpty()) {
            return hotelSearchService.formatHotels(hotels);
        }

        return hotels;
    }
}