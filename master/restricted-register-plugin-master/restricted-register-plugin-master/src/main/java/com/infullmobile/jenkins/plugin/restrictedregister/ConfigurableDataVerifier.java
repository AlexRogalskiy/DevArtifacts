package com.infullmobile.jenkins.plugin.restrictedregister;

import com.infullmobile.jenkins.plugin.restrictedregister.settings.RegistrationRuleConfig;
import net.sf.json.JSONObject;
import org.apache.tools.ant.ExtensionPoint;

/**
 * Created by Adam Kobus on 24.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public abstract class ConfigurableDataVerifier<T extends RegistrationRuleConfig> extends ExtensionPoint {

    public final boolean isFormDataValid(JSONObject payload, RegistrationRuleConfig registrationRuleConfig) {
        final T config = obtainConfig(obtainConfig(registrationRuleConfig));
        return this.isFormDataValidImpl(payload, config);
    }

    /**
     * This method should check {@link JSONObject} for any issues that would prevent creating new
     * {@link hudson.model.User} instance.
     */
    public abstract boolean isFormDataValidImpl(JSONObject payload, T config);

    public abstract boolean isConfigTypeValid(RegistrationRuleConfig config);

    private T obtainConfig(RegistrationRuleConfig config) {
        if (isConfigTypeValid(config)) {
            //noinspection unchecked
            return (T) config;
        }
        return null;
    }
}
