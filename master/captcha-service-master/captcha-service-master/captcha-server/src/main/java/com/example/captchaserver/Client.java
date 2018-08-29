package com.example.captchaserver;

import com.fasterxml.jackson.databind.util.JSONPObject;
import org.json.JSONObject;

import java.util.UUID;

public class Client implements FactoryObject {
    private String publicKeyAttribute  = "public";
    private String privateKeyAttribute = "secret";

    private UUID publicKey;
    private UUID privateKey;

    public Client(UUID passedPublicKey, UUID passedPrivateKey) {
        publicKey  = passedPublicKey;
        privateKey = passedPrivateKey;
    }

    public String publicKey() {
        return publicKey.toString();
    }

    public String privateKey() {
        return privateKey.toString();
    }

    public JSONObject toJson() {
        return new JSONObject()
                .put(publicKeyAttribute,  publicKey)
                .put(privateKeyAttribute, privateKey);
    }
}


