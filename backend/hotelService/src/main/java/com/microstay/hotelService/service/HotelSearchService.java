package com.microstay.hotelService.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.microstay.hotelService.dto.HotelSearchFilter;
import com.microstay.hotelService.entity.Hotel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HotelSearchService {

        private final MongoTemplate mongoTemplate;

        public List<Hotel> searchWithFilter(HotelSearchFilter filter) {

                Query query = new Query();

                // ---------- HOTEL LEVEL FILTERS ----------

                if (filter.getCity() != null) {
                        query.addCriteria(
                                        Criteria.where("location.city")
                                                        .regex(filter.getCity(), "i"));
                }

                if (filter.getBrand() != null) {
                        query.addCriteria(
                                        Criteria.where("brand")
                                                        .regex(filter.getBrand(), "i"));
                }

                if (filter.getHotelName() != null) {
                        query.addCriteria(
                                        Criteria.where("name")
                                                        .regex(filter.getHotelName(), "i"));
                }

                if (filter.getStarRating() != null) {
                        query.addCriteria(
                                        Criteria.where("starRating")
                                                        .is(filter.getStarRating()));
                }

                if (filter.getMinRating() != null) {
                        query.addCriteria(
                                        Criteria.where("ratingSummary.average")
                                                        .gte(filter.getMinRating()));
                }

                if (filter.getMaxRating() != null) {
                        query.addCriteria(
                                        Criteria.where("ratingSummary.average")
                                                        .lte(filter.getMaxRating()));
                }

                if (filter.getFacilities() != null && !filter.getFacilities().isEmpty()) {
                        query.addCriteria(
                                        Criteria.where("facilities")
                                                        .in(filter.getFacilities()));
                }

                if (filter.getPetsAllowed() != null) {
                        query.addCriteria(
                                        Criteria.where("policies.petsAllowed")
                                                        .is(filter.getPetsAllowed()));
                }

                if (filter.getSmokingAllowed() != null) {
                        query.addCriteria(
                                        Criteria.where("policies.smokingAllowed")
                                                        .is(filter.getSmokingAllowed()));
                }

                if (filter.getCancellationPolicy() != null) {
                        query.addCriteria(
                                        Criteria.where("policies.cancellation")
                                                        .regex(filter.getCancellationPolicy(), "i"));
                }

                // Only show ACTIVE hotels
                query.addCriteria(Criteria.where("status").is(com.microstay.hotelService.entity.HotelStatus.ACTIVE));

                // ---------- ROOM LEVEL FILTERS ----------

                List<Criteria> roomCriteria = new ArrayList<>();

                roomCriteria.add(Criteria.where("active").is(true));

                if (filter.getRoomType() != null) {
                        roomCriteria.add(
                                        Criteria.where("roomType")
                                                        .is(filter.getRoomType()));
                }

                if (filter.getAdults() != null) {
                        roomCriteria.add(
                                        Criteria.where("maxAdults")
                                                        .gte(filter.getAdults()));
                }

                if (filter.getChildren() != null) {
                        roomCriteria.add(
                                        Criteria.where("maxChildren")
                                                        .gte(filter.getChildren()));
                }

                if (filter.getTotalGuests() != null) {
                        roomCriteria.add(
                                        Criteria.where("maxAdults")
                                                        .gte(filter.getTotalGuests()));
                }

                if (filter.getPriceUnder() != null) {
                        roomCriteria.add(
                                        Criteria.where("pricing.basePrice")
                                                        .lte(filter.getPriceUnder()));
                }

                if (filter.getPriceAbove() != null) {
                        roomCriteria.add(
                                        Criteria.where("pricing.basePrice")
                                                        .gte(filter.getPriceAbove()));
                }

                if (filter.getAmenities() != null && !filter.getAmenities().isEmpty()) {
                        roomCriteria.add(
                                        Criteria.where("amenities")
                                                        .all(filter.getAmenities()));
                }

                // ---------- DATE AVAILABILITY ----------

                LocalDate date = filter.getDate();

                if (date != null) {
                        roomCriteria.add(
                                        Criteria.where("availability")
                                                        .elemMatch(
                                                                        Criteria.where("date")
                                                                                        .is(date)
                                                                                        .and("availableRooms").gt(0)));
                }

                // check-in / check-out support
                if (filter.getCheckInDate() != null && filter.getCheckOutDate() != null) {

                        roomCriteria.add(
                                        Criteria.where("availability")
                                                        .elemMatch(
                                                                        Criteria.where("date")
                                                                                        .gte(filter.getCheckInDate())
                                                                                        .lte(filter.getCheckOutDate())
                                                                                        .and("availableRooms").gt(0)));
                }

                if (!roomCriteria.isEmpty()) {

                        query.addCriteria(
                                        Criteria.where("rooms")
                                                        .elemMatch(new Criteria()
                                                                        .andOperator(roomCriteria
                                                                                        .toArray(new Criteria[0]))));
                }

                // ---------- SORTING ----------

                Sort sort;

                if ("priceAsc".equalsIgnoreCase(filter.getSort())) {
                        sort = Sort.by(Sort.Direction.ASC, "rooms.pricing.basePrice");
                } else if ("priceDesc".equalsIgnoreCase(filter.getSort())) {
                        sort = Sort.by(Sort.Direction.DESC, "rooms.pricing.basePrice");
                } else if ("ratingAsc".equalsIgnoreCase(filter.getSort())) {
                        sort = Sort.by(Sort.Direction.ASC, "ratingSummary.average");
                } else {
                        sort = Sort.by(Sort.Direction.DESC, "ratingSummary.average");
                }

                query.with(sort);

                // ---------- LIMIT ----------
                query.limit(10);

                System.out.println("Executing Query: " + query);

                return mongoTemplate.find(query, Hotel.class);
        }

        // ---------- RESPONSE FORMATTER ----------

        public String formatHotels(List<Hotel> hotels) {

                if (hotels.isEmpty()) {
                        return "No hotels found matching your criteria.";
                }

                StringBuilder response = new StringBuilder();

                hotels.forEach(hotel -> {

                        response.append("🏨 ")
                                        .append(hotel.getName());

                        if (hotel.getStarRating() != null) {
                                response.append(" (").append(hotel.getStarRating()).append("⭐)");
                        }

                        response.append("\n📍 ")
                                        .append(hotel.getLocation().getCity());

                        if (hotel.getRatingSummary() != null) {
                                response.append(" | 🌟 ")
                                                .append(hotel.getRatingSummary().getAverage());
                        }

                        response.append("\n");

                        hotel.getRooms().stream().limit(2).forEach(room -> {

                                response.append(" • ")
                                                .append(room.getRoomType())
                                                .append(" ₹")
                                                .append(room.getPricing().getBasePrice())
                                                .append("\n");
                        });

                        response.append("\n");

                });

                return response.toString();
        }
}