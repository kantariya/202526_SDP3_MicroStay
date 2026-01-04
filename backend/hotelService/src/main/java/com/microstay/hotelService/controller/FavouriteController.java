package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.Favourite;
import com.microstay.hotelService.service.FavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/favourites")
@RequiredArgsConstructor
public class FavouriteController {

    private final FavouriteService favouriteService;

    @PostMapping("/{hotelId}")
    public void addFavourite(
            @PathVariable String hotelId,
            @RequestHeader("X-USER-ID") Long userId
    ) {
        favouriteService.addToFavourite(userId, hotelId);
    }

    @DeleteMapping("/{hotelId}")
    public void removeFavourite(
            @PathVariable String hotelId,
            @RequestHeader("X-USER-ID") Long userId
    ) {
        favouriteService.removeFromFavourite(userId, hotelId);
    }

    @GetMapping
    public List<Favourite> getUserFavourites(
            @RequestHeader("X-USER-ID") Long userId
    ) {
        return favouriteService.getUserFavourites(userId);
    }
}
