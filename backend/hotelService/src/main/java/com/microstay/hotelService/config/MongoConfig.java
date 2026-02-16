package com.microstay.hotelService.config;

import com.microstay.hotelService.converter.DateToLocalDateConverter;
import com.microstay.hotelService.converter.LocalDateToDateConverter;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;



import java.util.*;

@Configuration
public class MongoConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(
                new LocalDateToDateConverter(),
                new DateToLocalDateConverter()
        ));
    }
}
