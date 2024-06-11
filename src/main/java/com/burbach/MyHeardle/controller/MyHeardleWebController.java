package com.burbach.MyHeardle.controller;

import com.burbach.MyHeardle.Domain.Token;
import com.burbach.MyHeardle.service.TokenService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.support.SessionStatus;

@Controller
@RequiredArgsConstructor
public class MyHeardleWebController {

    private final TokenService tokenService;

    @GetMapping("/")
    public String login() {
        return "login";
    }

    @PostMapping("/play")
    public String playGame(@RequestBody String code, HttpSession httpSession) {
        Token token = tokenService.getAccessTokenFromCode(code);
        httpSession.setAttribute("token", token);

        return "play";
    }

    @GetMapping("/play")
    public String playGame(Model model, HttpSession httpSession, SessionStatus sessionStatus) {
        Token token = (Token)httpSession.getAttribute("token");
        if (token != null) {
            model.addAttribute("token", token);
            sessionStatus.setComplete();
        }
        return "play";
    }
}
