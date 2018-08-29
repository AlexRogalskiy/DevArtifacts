package com.example.captchaserver;

import java.util.HashMap;
import java.util.UUID;

public abstract class AbstractIndexingFactory {
    protected HashMap<UUID, FactoryObject> objects;

    public abstract FactoryObject createObject();

    public AbstractIndexingFactory() {
        objects = new HashMap<>();
    }

    public FactoryObject getObject(String uuid) {
        return objects.get(UUID.fromString(uuid));
    }

    public Boolean removeObject(String uuid) {
        return objects.remove(UUID.fromString(uuid)) != null;
    }

    protected UUID generateUniqueUUID() {
        UUID someUUID;
        do {
            someUUID = UUID.randomUUID();
        } while (objects.containsKey(someUUID));
        return someUUID;
    }
}
