package com.javabeast.service;

import com.javabeast.domain.SubscriptionType;
import com.stripe.Stripe;
import com.stripe.exception.*;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
public class PaymentService {
    static {
        Stripe.apiKey = "sk_test_3wiySWLrPScKz7JDClYgv4FH";
    }

    public Customer createCustomer(final String email, final String token) throws CardException, APIException, AuthenticationException, InvalidRequestException, APIConnectionException {
        final Map<String, Object> customerParams = new HashMap<>();
        customerParams.put("email", email);
        customerParams.put("source", token);
        return Customer.create(customerParams);
    }

    public Charge createCharge(final String customerId, final int amount) throws CardException, APIException, AuthenticationException, InvalidRequestException, APIConnectionException {
        final Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", amount);
        chargeParams.put("currency", "gbp");
        chargeParams.put("customer", customerId);
        return Charge.create(chargeParams);
    }

    public double calculatePrice(final int numberOfTrackers, final SubscriptionType subscriptionType) {
        final double annual = 99;
        final double monthly = 9.99;
        final double unit = 200;

        final double totalUnitCost = unit * numberOfTrackers;

        if (subscriptionType == SubscriptionType.MONTHLY) {
            return (numberOfTrackers * monthly) + totalUnitCost;
        } else {
            return (numberOfTrackers * annual) + totalUnitCost;
        }
    }
}
