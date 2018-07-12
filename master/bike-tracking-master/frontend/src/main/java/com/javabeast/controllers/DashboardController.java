package com.javabeast.controllers;

import com.javabeast.TrackerMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;

@RestController
@RequestMapping("dashboard")
public class DashboardController {

    private final RestTemplate restTemplate;

    @Value("${backend.url}")
    private String backendUrl;

    @Autowired
    public DashboardController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping
    public ModelAndView getMap() {
        return new ModelAndView("dashboard", new HashMap<>());
    }

    @GetMapping("location")
    public TrackerMessage getLocation() {
        return restTemplate.getForObject(backendUrl + "/device/357454071854283", TrackerMessage.class);
    }
}
