package com.burbach.MyHeardle.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class CustomException extends ResponseStatusException {

    public CustomException(HttpStatusCode statusCode) {
        super(statusCode);
    }

    public CustomException(HttpStatusCode statusCode, String reason) {
        super(statusCode, reason);
    }

    public CustomException(HttpStatusCode statusCode, String reason, Throwable e) {
        super(statusCode, reason, e);
    }
}
