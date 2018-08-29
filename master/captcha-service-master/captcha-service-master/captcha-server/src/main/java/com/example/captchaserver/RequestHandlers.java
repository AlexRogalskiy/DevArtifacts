package com.example.captchaserver;

public class RequestHandlers {
    public static CaptchaRequestsHandler captchaReqHandler = new CaptchaRequestsHandler(CommandLineArguments.getTimeForAnswer());
    public static ClientRequestsHandler  clientReqHandler  = new ClientRequestsHandler();
}
