package com.burbach.MyHeardle.client;

import com.burbach.MyHeardle.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

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
                    .onStatus(HttpStatusCode::isError, clientResponse -> switch (clientResponse.statusCode()) {
                                case HttpStatus.BAD_REQUEST ->
                                        Mono.error(new CustomException(HttpStatus.BAD_REQUEST, uri.getPath()));
                                case HttpStatus.UNAUTHORIZED ->
                                        Mono.error(new CustomException(HttpStatus.UNAUTHORIZED, uri.getPath()));
                                case HttpStatus.FORBIDDEN ->
                                        Mono.error(new CustomException(HttpStatus.FORBIDDEN, uri.getPath()));
                                case HttpStatus.NOT_FOUND ->
                                        Mono.error(new CustomException(HttpStatus.NOT_FOUND, uri.getPath()));
                                case HttpStatus.INTERNAL_SERVER_ERROR ->
                                        Mono.error(new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, uri.getPath()));
                                default -> Mono.error(new RuntimeException("Something went wrong calling: " + uri.getPath()));
                            }
                    )
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
