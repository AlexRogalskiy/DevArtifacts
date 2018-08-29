package com.example.captchaserver;

import org.json.JSONObject;

public class ClientRequestsHandler {
    private ClientFactory clientFactory;

    public ClientRequestsHandler() {
        clientFactory= new ClientFactory();
    }

    public Client register() {
        return ((Client) clientFactory.createObject());
    }

    public Boolean isClientPresent(String uuid, Boolean isPublicKey) {
        return clientFactory.isClientPresent(uuid, isPublicKey);
    }
}
