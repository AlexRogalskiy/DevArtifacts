package org.jboss.jws.jwsapp;

import java.time.LocalDateTime;
import java.util.HashMap;

class StatusService {

    static HashMap<String, String> isUp() {

        HashMap<String, String> model = new HashMap<>();

        model.put("status", "The Java REST API is now up!");
        model.put("time", LocalDateTime.now().toString());

        return model;

    }
}