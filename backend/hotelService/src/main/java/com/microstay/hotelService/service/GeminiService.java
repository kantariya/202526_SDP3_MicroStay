package com.microstay.hotelService.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class GeminiService {

  @Value("${gemini.api.key}")
  private String apiKey;

  @Value("${gemini.api.url}")
  private String apiUrl;

  private final WebClient webClient;

  public String extractFilters(String userMessage) {

    String prompt = """
        You are a hotel search assistant.
        Extract hotel search filters from the user message.
        Return ONLY valid JSON.
        Do NOT return explanations.
        Do NOT return markdown.
        If a value is missing return null.

        Rules:
        - Fix spelling mistakes and normalize the text
        - Understand short forms (ex: htls = hotels, 5k = 5000, 4str = 4 star)
        - Detect intent even if the sentence is messy
        - Return ONLY JSON
        - Do not include explanations

        Understand:
        - spelling mistakes
        - short forms
        - natural language
        - synonyms

        Examples of meaning:
        cheap / budget → priceUnder = 3000
        luxury / premium → starRating = 5
        couple → adults = 2
        family → adults = 2, children = 2
        kids → children = 1
        5k → 5000
        10k → 10000

        Facilities examples: pool, wifi, beach, breakfast, parking, gym, spa.
        Date examples:
        today → today's date
        tomorrow → tomorrow's date
        next weekend → next Saturday

        JSON format:
        {
          "city": null,
          "starRating": null,
          "brand": null,
          "hotelName": null,
          "priceUnder": null,
          "priceAbove": null,
          "roomType": null,
          "adults": null,
          "children": null,
          "totalGuests": null,
          "facilities": [],
          "amenities": [],
          "date": null,
          "checkInDate": null,
          "checkOutDate": null,
          "minRating": null,
          "maxRating": null,
          "petsAllowed": null,
          "smokingAllowed": null,
          "cancellationPolicy": null,
          "sort": null,
          "distanceKm": null
        }

        User message:
        """ + userMessage;

    String escapedPrompt = prompt
        .replace("\\", "\\\\")
        .replace("\"", "\\\"")
        .replace("\n", "\\n");

    String requestBody = """
        {
          "contents": [
            {
              "parts": [
                {
                  "text": "%s"
                }
              ]
            }
          ]
        }
        """.replace("%s", escapedPrompt);

    return webClient.post()
        .uri(apiUrl + "?key=" + apiKey) // ✅ FIX
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(requestBody)
        .retrieve()

        // ✅ Better error handling
        .onStatus(status -> status.isError(), response -> response.bodyToMono(String.class).flatMap(errorBody -> {
          int code = response.statusCode().value();

          System.err.println("Gemini Error (" + code + "): " + errorBody);

          return Mono.error(new RuntimeException(code + ":" + errorBody));
        }))

        .bodyToMono(String.class)

        // ✅ FIX 2: Handle BOTH 503 and 429
        .retryWhen(
            Retry.backoff(3, Duration.ofSeconds(2))
                .filter(error -> error.getMessage().contains("503") ||
                    error.getMessage().contains("UNAVAILABLE") ||
                    error.getMessage().contains("429") ||
                    error.getMessage().contains("RESOURCE_EXHAUSTED"))
                .doBeforeRetry(retry -> System.out.println("Retrying... Attempt: " + (retry.totalRetries() + 1))))

        // ✅ Final fallback
        .onErrorResume(e -> {
          System.err.println("Final Error: " + e.getMessage());
          return Mono.just("{}");
        })

        .block();
  }
}