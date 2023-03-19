package com.csci334.ConferenceMagment.domain.exception;

import java.text.MessageFormat;

public class userNotFoundException extends RuntimeException {
    public userNotFoundException(String username) {
        super(MessageFormat.format("user not found by username{0}",username));
    }
}
