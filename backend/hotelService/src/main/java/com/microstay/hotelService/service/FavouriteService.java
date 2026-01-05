package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Favourite;
import com.microstay.hotelService.exception.BadRequestException;
import com.microstay.hotelService.exception.ResourceNotFoundException;
import com.microstay.hotelService.repository.FavouriteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteRepository favouriteRepository;

    public void addToFavourite(Long userId, String hotelId) {
        // Validate inputs
        if (userId == null || userId <= 0) {
            throw new BadRequestException("User ID is required and must be positive");
        }
        if (!StringUtils.hasText(hotelId)) {
            throw new BadRequestException("Hotel ID cannot be empty");
        }

        // Check if already exists
        favouriteRepository.findByUserIdAndHotelId(userId, hotelId)
                .ifPresent(f -> {
                    throw new BadRequestException("Hotel is already in your favourites");
                });

        Favourite favourite = new Favourite();
        favourite.setUserId(userId);
        favourite.setHotelId(hotelId);

        favouriteRepository.save(favourite);
        log.info("Hotel {} added to favourites for user {}", hotelId, userId);
    }

    public void removeFromFavourite(Long userId, String hotelId) {
        // Validate inputs
        if (userId == null || userId <= 0) {
            throw new BadRequestException("User ID is required and must be positive");
        }
        if (!StringUtils.hasText(hotelId)) {
            throw new BadRequestException("Hotel ID cannot be empty");
        }

        Favourite fav = favouriteRepository
                .findByUserIdAndHotelId(userId, hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Favourite not found"));

        favouriteRepository.delete(fav);
        log.info("Hotel {} removed from favourites for user {}", hotelId, userId);
    }

    public List<Favourite> getUserFavourites(Long userId) {
        // Validate userId
        if (userId == null || userId <= 0) {
            throw new BadRequestException("User ID is required and must be positive");
        }

        return favouriteRepository.findByUserId(userId);
    }
}
