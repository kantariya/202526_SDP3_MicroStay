package com.microstay.hotelService.controller;

import com.microstay.hotelService.entity.Favourite;
import com.microstay.hotelService.service.FavouriteService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favourites")
@RequiredArgsConstructor
@Validated
public class FavouriteController {

    private final FavouriteService favouriteService;

    @PostMapping("/{hotelId}")
    public ResponseEntity<Void> addFavourite(
            @PathVariable @NotBlank(message = "Hotel ID cannot be blank") String hotelId,
            @RequestHeader("X-USER-ID") @NotNull(message = "User ID is required") @Positive(message = "User ID must be positive") Long userId
    ) {
        favouriteService.addToFavourite(userId, hotelId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{hotelId}")
    public ResponseEntity<Void> removeFavourite(
            @PathVariable @NotBlank(message = "Hotel ID cannot be blank") String hotelId,
            @RequestHeader("X-USER-ID") @NotNull(message = "User ID is required") @Positive(message = "User ID must be positive") Long userId
    ) {
        favouriteService.removeFromFavourite(userId, hotelId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Favourite>> getUserFavourites(
            @RequestHeader("X-USER-ID") @NotNull(message = "User ID is required") @Positive(message = "User ID must be positive") Long userId
    ) {
        List<Favourite> favourites = favouriteService.getUserFavourites(userId);
        return ResponseEntity.ok(favourites);
    }
}
