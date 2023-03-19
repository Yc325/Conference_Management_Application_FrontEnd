package com.csci334.ConferenceMagment.domain.exception;

import java.text.MessageFormat;

public class PaperNotFoundException extends RuntimeException {
    public PaperNotFoundException(Long id){
        super(MessageFormat.format("paper not found by paper ID {0}",id));
    }
}
