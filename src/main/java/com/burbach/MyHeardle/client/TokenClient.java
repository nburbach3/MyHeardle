package com.burbach.MyHeardle.client;

import com.burbach.MyHeardle.Domain.Token;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.net.URI;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class TokenClient {

    @Value("${spotify.client.id:}")
    private String clientId;

    @Value("${spotify.client.secret:}")
    private String clientSecret;

    @Value("${redirect.uri:}")
    private String redirectUri;

    @Autowired
    private final ConfigurableEnvironment env;

    private final WebClientWrapper webClientWrapper;

    private static final String AUTHORIZATION_CODE = "authorization_code";

    private static final String REFRESH_TOKEN = "refresh_token";

    private static final String TOKEN = "https://accounts.spotify.com/api/token";

    public Token getAccessTokenFromRefresh(String refreshToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret);

        MultiValueMap<String, String> formUrlEncodedParams = new LinkedMultiValueMap<>();
        formUrlEncodedParams.add("grant_type", REFRESH_TOKEN);
        formUrlEncodedParams.add("refresh_token", refreshToken);

        return webClientWrapper.callPostEndpoint(URI.create(TOKEN), headers, formUrlEncodedParams, Token.class).getBody();
    }

    public Token getAccessTokenFromCode(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret);

        MultiValueMap<String, String> formUrlEncodedParams = new LinkedMultiValueMap<>();
        formUrlEncodedParams.add("grant_type", AUTHORIZATION_CODE);
        formUrlEncodedParams.add("code", code);
        formUrlEncodedParams.add("redirect_uri", redirectUri);

        return webClientWrapper.callPostEndpoint(URI.create(TOKEN), headers, formUrlEncodedParams, Token.class).getBody();
    }
}
