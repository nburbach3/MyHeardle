package com.burbach.MyHeardle.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;

import java.time.Duration;

@Configuration
public class MyHeardleConfiguration {

    private final static int size = 16 * 1024 * 1024;
    @Bean
    public WebClient webClient() {
        ConnectionProvider connectionProvider = ConnectionProvider.builder("My Heardle")
                .maxConnections(500)
                .pendingAcquireTimeout(Duration.ofSeconds(45))
                .maxIdleTime(Duration.ofSeconds(600))
                .build();
        HttpClient client = HttpClient.create(connectionProvider);
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();
        return WebClient.builder()
               .exchangeStrategies(strategies)
                .clientConnector(new ReactorClientHttpConnector(client))
               .build();
    }
}
