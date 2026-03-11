package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Hotel;
import com.microstay.hotelService.entity.HotelStatus;
import com.microstay.hotelService.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AdminHotelService {

    private final HotelRepository hotelRepository;
    private final MongoTemplate mongoTemplate;

    // Admin create hotel
    public Hotel createHotel(Hotel hotel) {

        hotel.setId(null); // ensure new
        hotel.setStatus(HotelStatus.PENDING);
        hotel.setCreatedAt(Instant.now());
        hotel.setUpdatedAt(Instant.now());
        hotel.setRooms(new ArrayList<>());

        return hotelRepository.save(hotel);
    }

    // List hotels with optional filters
    public Page<Hotel> listHotels(
            HotelStatus status,
            String managerId,
            String nameSearch,
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // Filter by status
        if (status != null) {
            criteriaList.add(Criteria.where("status").is(status));
        }

        // Filter by managerId
        if (managerId != null && !managerId.isBlank()) {
            criteriaList.add(Criteria.where("managerId").is(managerId));
        }

        // Search by name (case-insensitive)
        if (nameSearch != null && !nameSearch.isBlank()) {
            Pattern pattern = Pattern.compile(nameSearch, Pattern.CASE_INSENSITIVE);
            criteriaList.add(Criteria.where("name").regex(pattern));
        }

        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(
                    criteriaList.toArray(new Criteria[0])
            ));
        }

        // Sorting logic
        Sort sort;

        if (sortBy == null || sortBy.isBlank()) {
            sort = Sort.by("name").ascending(); // default
        } else {
            Sort.Direction dir =
                    "desc".equalsIgnoreCase(direction)
                            ? Sort.Direction.DESC
                            : Sort.Direction.ASC;

            sort = Sort.by(dir, sortBy);
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        query.with(pageable);

        List<Hotel> hotels = mongoTemplate.find(query, Hotel.class);

        long total = mongoTemplate.count(
                Query.of(query).limit(-1).skip(-1),
                Hotel.class
        );

        return new PageImpl<>(hotels, pageable, total);
    }

    // Change hotel status
    public Hotel changeStatus(String hotelId, HotelStatus status) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        hotel.setStatus(status);
        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }

    // Assign manager
    public Hotel assignManager(String hotelId, String managerId) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        System.out.println("Assigning managerId: " + managerId + " to hotel: " + hotel.getName());

        if (managerId == null || managerId.isBlank()) {
            hotel.setManagerId(null);
        } else {
            hotel.setManagerId(managerId);
        }
        hotel.setUpdatedAt(Instant.now());

        return hotelRepository.save(hotel);
    }
}