package com.microstay.userService.service;

import com.microstay.userService.entity.UserFavourite;
import com.microstay.userService.repository.UserFavouriteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserFavouriteService {

    private final UserFavouriteRepository repository;

    // ADD TO FAVOURITES
    public UserFavourite addFavourite(Long userId, String hotelId) {

        if (repository.existsByUserIdAndHotelId(userId, hotelId)) {
            throw new RuntimeException("Hotel already in favourites");
        }

        UserFavourite fav = new UserFavourite();
        fav.setUserId(userId);
        fav.setHotelId(hotelId);
        fav.setCreatedAt(Instant.now());

        return repository.save(fav);
    }

    // REMOVE FROM FAVOURITES
    @Transactional
    public void removeFavourite(Long userId, String hotelId) {
        repository.deleteByUserIdAndHotelId(userId, hotelId);
    }

    // GET ALL USER FAVOURITES
    public List<UserFavourite> getUserFavourites(Long userId) {
        return repository.findByUserId(userId);
    }
}
