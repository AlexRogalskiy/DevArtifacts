package com.javabeast.controllers;

import com.javabeast.domain.SubscriptionType;
import com.javabeast.domain.WebsiteOrder;
import com.javabeast.domain.WebsitePayment;
import com.javabeast.service.PaymentService;
import com.stripe.exception.*;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("payment")
public class PaymentController {


    private static final String VIEW_NAME = "payment";

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(final PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public String getPayment(final WebsitePayment websitePayment, final HttpSession httpSession) {
        setPriceForOrder(websitePayment, httpSession);
        return VIEW_NAME;
    }

    @PostMapping
    public String postPayment(@ModelAttribute @Valid final WebsitePayment websitePayment, final BindingResult bindingResult, final HttpSession httpSession) throws CardException, APIException, AuthenticationException, InvalidRequestException, APIConnectionException {
        setPriceForOrder(websitePayment, httpSession);

        if (bindingResult.hasErrors()) {
            return VIEW_NAME;
        }

        try {
            final Customer customer = paymentService.createCustomer(websitePayment.getEmail(), websitePayment.getPaymentToken());
            final Charge charge = paymentService.createCharge(customer.getId(), (int)(websitePayment.getPrice() * 100));
            return "redirect:/payment/complete?" + charge.getId();
        } catch (Exception e) {
            e.printStackTrace();
            return VIEW_NAME;
        }
    }


    @GetMapping("/complete")
    public String getComplete() {

        return "complete";
    }


    private void setPriceForOrder(WebsitePayment websitePayment, HttpSession httpSession) {
        final WebsiteOrder websiteOrder = (WebsiteOrder) httpSession.getAttribute("order");
        if (websiteOrder == null) {
            websitePayment.setWebsiteOrder(WebsiteOrder.builder()
                    .numberOfTrackers(1)
                    .subscriptionType(SubscriptionType.MONTHLY)
                    .build());
        } else {
            websitePayment.setWebsiteOrder(websiteOrder);
        }
        final double price = paymentService.calculatePrice(websiteOrder.getNumberOfTrackers(), websiteOrder.getSubscriptionType());
        websitePayment.setPrice(price);
    }

}
