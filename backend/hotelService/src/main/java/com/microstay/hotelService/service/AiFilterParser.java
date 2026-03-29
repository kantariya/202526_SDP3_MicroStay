package com.microstay.hotelService.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microstay.hotelService.dto.HotelSearchFilter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiFilterParser {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public HotelSearchFilter parseFilters(String message) {

        try {

            String aiResponse = geminiService.extractFilters(message);
            System.out.println("Gemini RAW Response: " + aiResponse);

            if (aiResponse == null || aiResponse.equals("{}")) {
                return new HotelSearchFilter();
            }

            JsonNode root = objectMapper.readTree(aiResponse);

            if (root.has("error")) {
                System.err.println("Gemini API returned error: " + root.path("error").path("message").asText());
                return new HotelSearchFilter();
            }

            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                System.err.println("Gemini returned no candidates.");
                return new HotelSearchFilter();
            }

            JsonNode textNode = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            if (textNode == null || textNode.isMissingNode()) {
                System.err.println("Gemini returned empty text.");
                return new HotelSearchFilter();
            }

            String jsonText = textNode.asText();

            // remove markdown if AI adds it
            jsonText = jsonText
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            System.out.println("Parsed JSON: " + jsonText);

            return objectMapper.readValue(jsonText, HotelSearchFilter.class);

        } catch (Exception e) {

            e.printStackTrace();

            // return empty filters instead of crashing API
            return new HotelSearchFilter();
        }
    }
}