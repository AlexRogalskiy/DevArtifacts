package com.infullmobile.jenkins.plugin.restrictedregister.verifiers;

import com.infullmobile.jenkins.plugin.restrictedregister.ConfigurableDataVerifier;
import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.RegistrationRuleConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.util.Utils;
import hudson.Extension;
import net.sf.json.JSONObject;

/**
 * Created by Adam Kobus on 25.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
@Extension
public class SecretKeyVerifier extends ConfigurableDataVerifier<SecretKeyConfig> {

    @Override
    public boolean isFormDataValidImpl(JSONObject payload, SecretKeyConfig config) {
        final String secretKey = Utils.fixEmptyString(payload.getString(BaseFormField.SECRET.getFieldName()));
        final String expectedSecret = Utils.fixEmptyString(config.getSecretKey());
        return secretKey.equals(expectedSecret);
    }

    @Override
    public boolean isConfigTypeValid(RegistrationRuleConfig config) {
        return SecretKeyConfig.class.equals(config.getClass());
    }
}
