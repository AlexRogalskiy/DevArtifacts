package com.javabeast.domain;

public enum SubscriptionType {
    MONTHLY("£9.99 - Monthly"),
    ANNUAL("£99 - Annually");

    SubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    private final String subscriptionType;

    public String getSubscriptionType() {
        return subscriptionType;
    }
}
