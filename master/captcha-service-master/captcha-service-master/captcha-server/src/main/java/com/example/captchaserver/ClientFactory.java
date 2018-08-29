package com.example.captchaserver;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class ClientFactory extends AbstractIndexingFactory {
    public ClientFactory() {
        super();
    }

    @Override
    public FactoryObject createObject() {
        UUID publicUUID = generateUniqueUUID();
        Client generatedClient = new Client(publicUUID, UUID.randomUUID());

        objects.put(publicUUID, generatedClient);
        return generatedClient;
    }

    public Boolean isClientPresent(String clientUUID, Boolean isPublicKey) {
        if (isPublicKey)
            return getObject(clientUUID) != null;
        else {
            for (Map.Entry<UUID, FactoryObject> entry : objects.entrySet()) {
                Client client = (Client) entry.getValue();
                if (client.privateKey().equals(clientUUID))
                    return true;
            }
            return false;
        }
    }
}
