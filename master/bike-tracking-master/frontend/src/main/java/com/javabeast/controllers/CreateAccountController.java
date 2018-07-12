package com.javabeast.controllers;

import com.javabeast.account.NewAccountDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


@Controller
@RequestMapping("createaccount")
public class CreateAccountController {

    private final RestTemplate restTemplate;

    @Value("${backend.url}")
    private String backendUrl;

    @Autowired
    public CreateAccountController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping
    public String showCreateAccount(Model model) {
        model.addAttribute("newAccountDTO", new NewAccountDTO());
        return "create_account";
    }

    @PostMapping
    public String tryCreateAccount(@ModelAttribute final NewAccountDTO newAccountDTO) {
        return "create_account";
    }

}
