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

            JsonNode root = objectMapper.readTree(aiResponse);
            HotelSearchFilter filter = objectMapper.treeToValue(root, HotelSearchFilter.class);

            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                throw new RuntimeException("Gemini returned no candidates");
            }

            JsonNode textNode = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            if (textNode == null || textNode.isMissingNode()) {
                throw new RuntimeException("Gemini returned empty text");
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