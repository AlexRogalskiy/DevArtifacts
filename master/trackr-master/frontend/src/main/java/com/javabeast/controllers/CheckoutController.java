package com.javabeast.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;

@RestController
@RequestMapping("checkout")
public class CheckoutController {


    private static final String VIEW_NAME = "checkout";

    public CheckoutController() {
    }

    @GetMapping
    public ModelAndView getMap() {
        return new ModelAndView(VIEW_NAME, new HashMap<>());
    }

}
