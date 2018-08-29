package com.example.captchaserver;

public class RequestException extends Exception {
    public RequestException() { super(); }
    public RequestException(String message) { super(message); }
    public RequestException(String message, Throwable cause) { super(message, cause); }
    public RequestException(Throwable cause) { super(cause); }
}
