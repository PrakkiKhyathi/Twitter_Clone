package com.twitter.MediaMS.exception;

import com.twitter.MediaMS.entity.Media;

public class MediaException extends Exception{
    private static final long serialVersionUID=1L;
    public MediaException(String message)
    {
        super(message);
    }
}
