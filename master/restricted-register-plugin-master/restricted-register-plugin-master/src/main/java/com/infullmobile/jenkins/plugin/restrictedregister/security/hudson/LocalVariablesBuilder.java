package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson;

import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.data.LocalVariables;
import com.infullmobile.jenkins.plugin.restrictedregister.util.AppUrls;
import com.infullmobile.jenkins.plugin.restrictedregister.util.Utils;
import hudson.model.User;
import hudson.tasks.Mailer;
import net.sf.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class LocalVariablesBuilder {

    public static final String VAR_SIGN_IN_LINK = "RR_SIGN_IN_LINK";
    public static final String VAR_CONFIRMATION_LINK = "RR_CONFIRMATION_LINK";
    public static final String VAR_USER_DISPLAY_NAME = "RR_USER_DISPLAY_NAME";
    public static final String VAR_USER_EMAIL = "RR_USER_EMAIL";
    public static final String VAR_USER_ID = "RR_USER_ID";

    private User user;
    private JSONObject payload;

    private LocalVariablesBuilder() {

    }

    public LocalVariablesBuilder user(User user) {
        this.user = user;
        return this;
    }

    public LocalVariablesBuilder payload(JSONObject payload) {
        this.payload = payload;
        return this;
    }

    public static LocalVariablesBuilder start() {
        return new LocalVariablesBuilder();
    }

    public LocalVariables build() {
        final Map<String, String> variables = new HashMap<>();
        variables.put(VAR_USER_DISPLAY_NAME, Utils.escapeInputString(user.getFullName()));
        variables.put(VAR_USER_ID, Utils.escapeInputString(user.getId()));
        final Mailer.UserProperty mailerProperty = user.getProperty(Mailer.UserProperty.class);
        if (mailerProperty != null) {
            variables.put(VAR_USER_EMAIL, Utils.escapeInputString(Utils.fixEmptyString(mailerProperty.getAddress())));
        } else {
            variables.put(VAR_USER_EMAIL, "");
        }
        final String secret = BaseFormField.SECRET.fromJSON(payload);
        final String code = RRHudsonUserProperty.getActivationCodeForUser(user);

        variables.put(VAR_CONFIRMATION_LINK, Utils.escapeInputString(AppUrls.buildActivationUrl(code, secret)));
        variables.put(VAR_SIGN_IN_LINK, Utils.escapeInputString(AppUrls.buildSignInUrl()));

        return new LocalVariables(variables);
    }
}
