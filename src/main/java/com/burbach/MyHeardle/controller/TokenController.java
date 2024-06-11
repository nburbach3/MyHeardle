package com.burbach.MyHeardle.controller;

import com.burbach.MyHeardle.Domain.Token;
import com.burbach.MyHeardle.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/token")
public class TokenController {

    private final TokenService tokenService;

    @PostMapping("/{refreshToken}")
    public Token getAccessTokenFromRefresh(@PathVariable("refreshToken") String refreshToken) {
        return tokenService.getAccessTokenFromRefresh(refreshToken);
    }
}
