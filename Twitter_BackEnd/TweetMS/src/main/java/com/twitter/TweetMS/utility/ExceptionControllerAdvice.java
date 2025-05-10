package com.twitter.TweetMS.utility;

import com.twitter.TweetMS.exception.TweetException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ExceptionControllerAdvice {
    @Autowired
    private Environment environment;
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorInfo> pathValidatorExceptionHandler(ConstraintViolationException exception)
    {
        ErrorInfo errorInfo=new ErrorInfo();
        String errorMsg=exception.getConstraintViolations().stream().map(e->e.getMessage()).collect(Collectors.joining(","));
        errorInfo.setErrorMessage(errorMsg);
        errorInfo.setErrorCode(HttpStatus.BAD_REQUEST.value());
        errorInfo.setTimeStamp(LocalDateTime.now());
        return new ResponseEntity<>(errorInfo,HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorInfo> validatorExceptionHandler(MethodArgumentNotValidException exception)
    {
        ErrorInfo errorInfo=new ErrorInfo();
        String errorMessage=exception.getBindingResult().getAllErrors().stream().map((e)->e.getDefaultMessage())
                .collect(Collectors.joining(","));
        errorInfo.setErrorMessage(errorMessage);
        errorInfo.setErrorCode(HttpStatus.BAD_REQUEST.value());
        errorInfo.setTimeStamp(LocalDateTime.now());
        return new ResponseEntity<>(errorInfo,HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(TweetException.class)
    public ResponseEntity<ErrorInfo> userException(TweetException exception)
    {
        ErrorInfo errorInfo=new ErrorInfo();
        errorInfo.setErrorMessage(exception.getMessage());
        errorInfo.setErrorCode(HttpStatus.BAD_REQUEST.value());
        errorInfo.setTimeStamp(LocalDateTime.now());
        return new ResponseEntity<>(errorInfo,HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorInfo> generalExceptionHandler(Exception exception)
    {
        ErrorInfo errorInfo=new ErrorInfo();
        errorInfo.setErrorMessage(environment.getProperty("General.ExceptionMessage"));
        errorInfo.setErrorCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorInfo.setTimeStamp(LocalDateTime.now());
        return new ResponseEntity<>(errorInfo,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
