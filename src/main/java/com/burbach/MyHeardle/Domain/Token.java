package com.burbach.MyHeardle.Domain;

import lombok.Data;

@Data
public class Token {
    private String access_token;
    private String token_type;
    private String scope;
    private int expires_in;
    private String refresh_token;
}
