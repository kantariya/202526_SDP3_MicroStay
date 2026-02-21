package com.microstay.hotelService.repository;

import com.microstay.hotelService.entity.Hotel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface HotelRepository extends MongoRepository<Hotel, String> {

        List<Hotel> findByLocationCityContainingIgnoreCase(String city);

        List<Hotel> findByManagerId(String managerId);

        List<Hotel> findByLocationCityContainingIgnoreCaseAndStatus(String city, String status);

        List<Hotel> findByStatus(String status);

        long countByStatus(String status);

        @Query("""
                        SELECT h FROM Hotel h
                        WHERE (:status IS NULL OR h.status = :status)
                        AND (:city IS NULL OR h.location.city = :city)
                        AND (:managerId IS NULL OR h.managerId = :managerId)
                        """)
        List<Hotel> findFiltered(
                        String status,
                        String city,
                        String managerId);

}
