package com.infullmobile.jenkins.plugin.restrictedregister.mail.data;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class LocalVariables {

    private static final String VARIABLE_WRAP_FORMAT = "${%s}";

    public static String wrap(String var) {
        return String.format(Locale.US, VARIABLE_WRAP_FORMAT, var);
    }

    private final Map<String, String> variables = new HashMap<>();

    public LocalVariables(Map<String, String> variables) {
        this.variables.putAll(variables);
    }

    public Map<String, String> getVariables() {
        synchronized (variables) {
            return new HashMap<>(variables);
        }
    }
}
