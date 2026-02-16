package com.microstay.userService.repository;

import com.microstay.userService.entity.UserFavourite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserFavouriteRepository extends JpaRepository<UserFavourite, Long> {

    List<UserFavourite> findByUserId(Long userId);

    Optional<UserFavourite> findByUserIdAndHotelId(Long userId, String hotelId);

    void deleteByUserIdAndHotelId(Long userId, String hotelId);

    boolean existsByUserIdAndHotelId(Long userId, String hotelId);
}
