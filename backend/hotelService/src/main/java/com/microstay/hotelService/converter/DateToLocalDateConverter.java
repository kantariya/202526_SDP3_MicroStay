package com.microstay.hotelService.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Date;

@ReadingConverter
public class DateToLocalDateConverter implements Converter<Date, LocalDate> {

    @Override
    public LocalDate convert(Date source) {
        return source.toInstant()
                .atZone(ZoneOffset.UTC)
                .toLocalDate();
    }
}
