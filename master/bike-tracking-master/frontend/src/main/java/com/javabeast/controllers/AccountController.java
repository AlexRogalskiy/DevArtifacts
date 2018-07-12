package com.javabeast.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/account")
public class AccountController {


    public AccountController() {
    }

    @GetMapping()
    public void user(final HttpServletRequest httpServletRequest) {
    }

}
