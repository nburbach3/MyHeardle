package com.burbach.MyHeardle.client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;

@Component
@RequiredArgsConstructor
public class WebClientWrapper {

    private final WebClient webClient;

    public <R> ResponseEntity<R> callPostEndpoint(URI uri, HttpHeaders headers, Object bodyValue, Class<R> responseType) {
        if (bodyValue != null) {
            return webClient.method(HttpMethod.POST)
                    .uri(uri)
                    .headers(httpHeaders -> httpHeaders.addAll(headers))
                    .bodyValue(bodyValue)
                    .retrieve()
                    .toEntity(responseType)
                    .block();
        } else {
            return webClient.method(HttpMethod.POST)
                    .uri(uri)
                    .headers(httpHeaders -> httpHeaders.addAll(headers))
                    .retrieve()
                    .toEntity(responseType)
                    .block();
        }
    }
}
