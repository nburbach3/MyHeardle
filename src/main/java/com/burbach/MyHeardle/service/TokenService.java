package com.burbach.MyHeardle.service;

import com.burbach.MyHeardle.Domain.Token;
import com.burbach.MyHeardle.client.TokenClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final TokenClient tokenClient;

    public Token getAccessTokenFromRefresh(String refreshToken) {
        return tokenClient.getAccessTokenFromRefresh(refreshToken);
    }

    public Token getAccessTokenFromCode(String code) {
        return tokenClient.getAccessTokenFromCode(code);
    }
}
