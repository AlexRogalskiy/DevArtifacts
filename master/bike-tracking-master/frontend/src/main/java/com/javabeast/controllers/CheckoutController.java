package com.javabeast.controllers;

import com.javabeast.domain.WebsiteOrder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

@Controller
@RequestMapping("checkout")
public class CheckoutController {


    private static final String VIEW_NAME = "checkout";

    @GetMapping
    public String getCheckout(final WebsiteOrder websiteOrder) {
        return VIEW_NAME;
    }

    @PostMapping
    public String postCheckout(@ModelAttribute @Valid final WebsiteOrder websiteOrder, final BindingResult bindingResult, final HttpSession httpSession) {
        if (bindingResult.hasErrors()) {
            return VIEW_NAME;
        }

        httpSession.setAttribute("order", websiteOrder);
        return "redirect:/payment";
    }

}
