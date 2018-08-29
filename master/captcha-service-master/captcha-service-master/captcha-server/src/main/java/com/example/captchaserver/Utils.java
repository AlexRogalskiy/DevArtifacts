package com.example.captchaserver;

import java.util.UUID;

public class Utils {
    public static Boolean isUUIDCorrect(String uuid) {
        try {
            UUID.fromString(uuid);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
