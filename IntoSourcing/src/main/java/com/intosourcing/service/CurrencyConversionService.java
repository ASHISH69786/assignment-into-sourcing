package com.intosourcing.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class CurrencyConversionService {

    @Value("${currency.api.url}")
    private String apiUrl;

    @Value("${currency.api.key}")
    private String apiKey;

    private final WebClient webClient;
    private final Map<String, BigDecimal> exchangeRateCache = new HashMap<>();
    private volatile long lastCacheUpdate = 0;
    private static final long CACHE_DURATION = 3600000; // 1 hour

    public CurrencyConversionService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public BigDecimal convertCurrency(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equals(toCurrency)) {
            return amount;
        }

        try {
            BigDecimal rate = getExchangeRate(fromCurrency, toCurrency);
            return amount.multiply(rate);
        } catch (Exception e) {
            log.error("Error converting {} {} to {}", amount, fromCurrency, toCurrency, e);
            return amount;
        }
    }

    public BigDecimal getExchangeRate(String fromCurrency, String toCurrency) {
        if (fromCurrency.equals(toCurrency)) {
            return BigDecimal.ONE;
        }

        String cacheKey = fromCurrency + "/" + toCurrency;

        // Check cache
        if (exchangeRateCache.containsKey(cacheKey)) {
            long age = System.currentTimeMillis() - lastCacheUpdate;
            if (age < CACHE_DURATION) {
                return exchangeRateCache.get(cacheKey);
            }
        }

        // Fetch from API
        BigDecimal rate = fetchFromAPI(fromCurrency, toCurrency);
        exchangeRateCache.put(cacheKey, rate);
        lastCacheUpdate = System.currentTimeMillis();

        return rate;
    }

    private BigDecimal fetchFromAPI(String fromCurrency, String toCurrency) {
        try {
            // Using Open Exchange Rates API format
            String url = apiUrl + fromCurrency;

            Map<String, Object> response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(java.time.Duration.ofSeconds(5))
                    .block();

            if (response != null && response.containsKey("rates")) {
                Map<String, Object> rates = (Map<String, Object>) response.get("rates");
                Object rateObj = rates.get(toCurrency);
                if (rateObj != null) {
                    return new BigDecimal(rateObj.toString());
                }
            }
        } catch (Exception e) {
            log.warn("Failed to fetch exchange rate from API: {}", e.getMessage());
        }

        // Return 1:1 as fallback
        return BigDecimal.ONE;
    }

    public void clearCache() {
        exchangeRateCache.clear();
        lastCacheUpdate = 0;
    }
}

