package com.microstay.hotelService.converter;

import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.WritingConverter;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Date;

@WritingConverter
public class LocalDateToDateConverter implements Converter<LocalDate, Date> {

    @Override
    public Date convert(LocalDate source) {
        return Date.from(source.atStartOfDay(ZoneOffset.UTC).toInstant());
    }
}
