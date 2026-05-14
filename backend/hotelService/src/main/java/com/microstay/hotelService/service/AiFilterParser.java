package com.microstay.hotelService.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microstay.hotelService.dto.HotelSearchFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiFilterParser {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public HotelSearchFilter parseFilters(String message) {

        try {

            String aiResponse = geminiService.extractFilters(message);
            log.debug("Received Gemini raw response length={}", aiResponse != null ? aiResponse.length() : 0);

            if (aiResponse == null || aiResponse.equals("{}")) {
                return new HotelSearchFilter();
            }

            JsonNode root = objectMapper.readTree(aiResponse);

            if (root.has("error")) {
                log.warn("Gemini API returned error: {}", root.path("error").path("message").asText());
                return new HotelSearchFilter();
            }

            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                log.warn("Gemini returned no candidates for message parsing");
                return new HotelSearchFilter();
            }

            JsonNode textNode = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            if (textNode == null || textNode.isMissingNode()) {
                log.warn("Gemini returned empty text for parsed filters");
                return new HotelSearchFilter();
            }

            String jsonText = textNode.asText();

            // remove markdown if AI adds it
            jsonText = jsonText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            log.debug("Parsed Gemini filter JSON: {}", jsonText);

            return objectMapper.readValue(jsonText, HotelSearchFilter.class);

        } catch (Exception e) {

            log.error("Failed to parse Gemini filters", e);

            // return empty filters instead of crashing API
            return new HotelSearchFilter();
        }
    }
}