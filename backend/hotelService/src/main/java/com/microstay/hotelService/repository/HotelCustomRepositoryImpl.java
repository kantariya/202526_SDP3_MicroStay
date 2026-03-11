package com.microstay.hotelService.repository;

import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import java.util.*;

import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.microstay.hotelService.entity.*;

@Repository
@Slf4j
public class HotelCustomRepositoryImpl implements HotelCustomRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

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
            Pageable pageable,
            String sortDirection
    ) {

        log.info("Hotel search request -> city: {}, checkIn: {}, checkOut: {}, minPrice: {}, maxPrice: {}, starRating: {}, roomType: {}, facilities: {}, page: {}, size: {}, sort: {}",
                city, checkIn, checkOut, minPrice, maxPrice, starRating, roomType, facilities,
                pageable.getPageNumber(), pageable.getPageSize(), sortDirection);

        List<AggregationOperation> operations = new ArrayList<>();

        // ---------------------------------------------------
        // 1️⃣ HOTEL LEVEL FILTERS
        // ---------------------------------------------------

        Criteria hotelCriteria = Criteria.where("location.city").is(city)
                .and("status").is(HotelStatus.ACTIVE);

        if (starRating != null) {
            hotelCriteria.and("starRating").is(starRating);
        }

        if (facilities != null && !facilities.isEmpty()) {
            hotelCriteria.and("facilities").all(facilities);
        }

        log.info("Hotel filter -> city={}, status={}", city, HotelStatus.ACTIVE);

        operations.add(Aggregation.match(hotelCriteria));

        // ---------------------------------------------------
        // 2️⃣ UNWIND ROOMS
        // ---------------------------------------------------

        operations.add(Aggregation.unwind("rooms"));

        Criteria roomCriteria = Criteria.where("rooms.active").is(true);

        if (roomType != null) {
            roomCriteria.and("rooms.roomType").is(roomType);
        }

        if (minPrice != null) {
            roomCriteria.and("rooms.pricing.basePrice").gte(minPrice);
        }

        if (maxPrice != null) {
            roomCriteria.and("rooms.pricing.basePrice").lte(maxPrice);
        }

        log.info("Room filter -> active=true, roomType={}, minPrice={}, maxPrice={}",
                roomType, minPrice, maxPrice);

        operations.add(Aggregation.match(roomCriteria));

        // ---------------------------------------------------
        // 3️⃣ AVAILABILITY LOGIC (UNCHANGED)
        // ---------------------------------------------------

        log.info("Availability filter -> checkIn={}, checkOut={}", checkIn, checkOut);

        operations.add(Aggregation.match(
                new Criteria().orOperator(

                        Criteria.where("rooms.availability").exists(false),

                        Criteria.where("rooms.availability").not().elemMatch(
                                Criteria.where("date").gte(checkIn).lt(checkOut)
                                        .and("availableRooms").lte(0)
                        )
                )
        ));

        // ---------------------------------------------------
        // 4️⃣ GROUP BACK TO HOTEL LEVEL
        // ---------------------------------------------------

        operations.add(
                Aggregation.group("_id")
                        .first("name").as("name")
                        .first("location").as("location")
                        .first("starRating").as("starRating")
                        .first("status").as("status")
                        .first("facilities").as("facilities")
                        .push("rooms").as("rooms")
                        .min("rooms.pricing.basePrice").as("minRoomPrice")   // ⭐ compute cheapest room
        );

        // ---------------------------------------------------
        // 5️⃣ SORT BY CHEAPEST ROOM
        // ---------------------------------------------------


        if (sortDirection != null && !sortDirection.isBlank()) {

            Sort sort = Sort.by("minRoomPrice");

            if (sortDirection.equalsIgnoreCase("desc")) {
                sort = sort.descending();
            } else if (sortDirection.equalsIgnoreCase("asc")) {
                sort = sort.ascending();
            }

            operations.add(Aggregation.sort(sort));

            log.info("Sorting applied -> direction: {}", sortDirection);
        } else {
            log.info("No sorting applied");
        }

        // ---------------------------------------------------
        // 6️⃣ PAGINATION
        // ---------------------------------------------------

        operations.add(Aggregation.skip(pageable.getOffset()));
        operations.add(Aggregation.limit(pageable.getPageSize()));

        Aggregation aggregation = Aggregation.newAggregation(operations);

        log.info("Aggregation pipeline: {}", aggregation);

        List<Hotel> hotels = mongoTemplate
                .aggregate(aggregation, "hotels", Hotel.class)
                .getMappedResults();

        log.info("Hotels returned from aggregation: {}", hotels.size());

        // ---------------------------------------------------
        // 7️⃣ TOTAL COUNT (CORRECT PAGINATION COUNT)
        // ---------------------------------------------------

        List<AggregationOperation> countOperations = new ArrayList<>();

        countOperations.add(Aggregation.match(hotelCriteria));
        countOperations.add(Aggregation.unwind("rooms"));
        countOperations.add(Aggregation.match(roomCriteria));

        countOperations.add(Aggregation.match(
                new Criteria().orOperator(
                        Criteria.where("rooms.availability").exists(false),
                        Criteria.where("rooms.availability").not().elemMatch(
                                Criteria.where("date").gte(checkIn).lt(checkOut)
                                        .and("availableRooms").lte(0)
                        )
                )
        ));

        countOperations.add(
                Aggregation.group("_id")
        );

        countOperations.add(Aggregation.count().as("total"));

        Aggregation countAggregation = Aggregation.newAggregation(countOperations);

        AggregationResults<Document> countResult =
                mongoTemplate.aggregate(countAggregation, "hotels", Document.class);

        long total = 0;

        if (!countResult.getMappedResults().isEmpty()) {
            total = countResult.getMappedResults().get(0).getInteger("total");
        }

        log.info("Total hotels matching search: {}", total);

        return new PageImpl<>(hotels, pageable, total);
    }
}

