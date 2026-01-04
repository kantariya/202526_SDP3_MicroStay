package com.microstay.hotelService.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "favourites")
public class Favourite {

    @Id
    private String id;

    @Indexed
    private Long userId;

    @Indexed
    private String hotelId;
}
