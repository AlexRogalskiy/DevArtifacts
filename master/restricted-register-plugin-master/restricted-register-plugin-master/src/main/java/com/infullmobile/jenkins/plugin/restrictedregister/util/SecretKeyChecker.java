package com.infullmobile.jenkins.plugin.restrictedregister.util;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.RegistrationRulesSet;
import com.infullmobile.jenkins.plugin.restrictedregister.verifiers.SecretKeyVerifier;
import net.sf.json.JSONObject;
import org.kohsuke.stapler.Stapler;
import org.kohsuke.stapler.StaplerRequest;

import java.util.List;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class SecretKeyChecker {

    private SecretKeyChecker() {

    }

    public static boolean isGetParamSecretValid() {
        String secret = null;
        final StaplerRequest request = Stapler.getCurrentRequest();
        if (request.hasParameter(BaseFormField.SECRET.getFieldName())) {
            secret = request.getParameter(BaseFormField.SECRET.getFieldName());
        }
        return isSecretKeyValid(secret);
    }

    public static boolean isSecretKeyValid(String secret) {
        final String fixedSecret = Utils.fixEmptyString(secret);
        final JSONObject payload = new JSONObject();
        payload.put(BaseFormField.SECRET.getFieldName(), fixedSecret);
        final SecretKeyVerifier secretKeyVerifier = new SecretKeyVerifier();
        final List<RegistrationRulesSet> rules = PluginModule.getDefault().getPluginDescriptor()
                .getGlobalConfig().getRulesList();
        for (RegistrationRulesSet rulesSet : rules) {
            if (rulesSet.validateDataWithVerifier(payload, secretKeyVerifier)) {
                return true;
            }
        }
        return rules.size() == 0;
    }
}
