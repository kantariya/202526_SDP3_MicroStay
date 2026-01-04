package com.microstay.hotelService.repository;

import com.microstay.hotelService.entity.Favourite;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FavouriteRepository extends MongoRepository<Favourite, String> {

    List<Favourite> findByUserId(Long userId);

    Optional<Favourite> findByUserIdAndHotelId(Long userId, String hotelId);
}
