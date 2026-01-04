package com.microstay.hotelService.service;

import com.microstay.hotelService.entity.Favourite;
import com.microstay.hotelService.repository.FavouriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final FavouriteRepository favouriteRepository;

    public void addToFavourite(Long userId, String hotelId) {

        favouriteRepository.findByUserIdAndHotelId(userId, hotelId)
                .ifPresent(f -> {
                    throw new RuntimeException("Hotel already saved");
                });

        Favourite favourite = new Favourite();
        favourite.setUserId(userId);
        favourite.setHotelId(hotelId);

        favouriteRepository.save(favourite);
    }

    public void removeFromFavourite(Long userId, String hotelId) {
        Favourite fav = favouriteRepository
                .findByUserIdAndHotelId(userId, hotelId)
                .orElseThrow(() -> new RuntimeException("Favourite not found"));

        favouriteRepository.delete(fav);
    }

    public List<Favourite> getUserFavourites(Long userId) {
        return favouriteRepository.findByUserId(userId);
    }
}
