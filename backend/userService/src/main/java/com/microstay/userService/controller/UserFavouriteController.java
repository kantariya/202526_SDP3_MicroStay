package com.microstay.userService.controller;

import com.microstay.userService.entity.UserFavourite;
import com.microstay.userService.service.UserFavouriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/favourites")
@RequiredArgsConstructor
public class UserFavouriteController {

    private final UserFavouriteService service;

    // ADD HOTEL TO FAVOURITES
    @PostMapping("/{hotelId}")
    public UserFavourite addFavourite(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String hotelId
    ) {
        return service.addFavourite(userId, hotelId);
    }

    // REMOVE HOTEL FROM FAVOURITES
    @DeleteMapping("/{hotelId}")
    public String removeFavourite(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable String hotelId
    ) {
        service.removeFavourite(userId, hotelId);
        return "Removed from favourites";
    }

    // GET ALL FAVOURITES
    @GetMapping
    public List<UserFavourite> getAll(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return service.getUserFavourites(userId);
    }
}
