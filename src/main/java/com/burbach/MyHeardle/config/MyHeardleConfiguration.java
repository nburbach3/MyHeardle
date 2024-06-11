package com.burbach.MyHeardle.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class MyHeardleConfiguration {

    private final static int size = 16 * 1024 * 1024;
    @Bean
    public WebClient webClient() {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(size))
                .build();
        return WebClient.builder()
               .exchangeStrategies(strategies)
               .build();
    }
}
