package com.infullmobile.jenkins.plugin.restrictedregister.security;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.RegistrationException;
import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.module.impl.JenkinsDescriptorImpl;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form.HudsonFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.IPluginConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.RegistrationRulesSet;
import hudson.ExtensionPoint;
import hudson.security.SecurityRealm;
import net.sf.json.JSONObject;

import javax.annotation.Nonnull;
import java.util.List;

/**
 * Created by Adam Kobus on 27.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public abstract class SecurityRealmRegistration<T extends SecurityRealm> implements ExtensionPoint {

    public final T getSecurityRealm() throws InvalidSecurityRealmException {
        final SecurityRealm securityRealm = JenkinsDescriptorImpl.getJenkinsInstanceOrDie().getSecurityRealm();
        if (isRegistrationForSecurityRealm(securityRealm)) {
            //noinspection unchecked
            return (T) JenkinsDescriptorImpl.getJenkinsInstanceOrDie().getSecurityRealm();
        } else {
            throw new InvalidSecurityRealmException();
        }
    }

    public abstract boolean isRegistrationForSecurityRealm(SecurityRealm realm);

    public RegistrationRulesSet findMatchingConfigRules(JSONObject payload) throws RegistrationException {
        final IPluginConfig config = getConfig();
        final List<RegistrationRulesSet> allRules = config.getRulesList();
        for (RegistrationRulesSet rulesSet : allRules) {
            if (rulesSet.isUserDataValid(payload)) {
                return rulesSet;
            }
        }
        return null;
    }

    public IPluginConfig getConfig() {
        return PluginModule.getDefault().getPluginDescriptor().getGlobalConfig();
    }

    public String getUsernameFormFieldName() {
        return BaseFormField.USERNAME.getFieldName();
    }

    public String getPasswordFormFieldName() {
        return HudsonFormField.PASSWORD.getFieldName();
    }

    public String getRepeatPasswordFormFieldName() {
        return HudsonFormField.PASSWORD_REPEAT.getFieldName();
    }

    public String getEmailFormFieldName() {
        return BaseFormField.EMAIL.getFieldName();
    }

    public String getDisplayNameFormFieldName() {
        return BaseFormField.DISPLAY_NAME.getFieldName();
    }

    public String getSecretFormFieldName() {
        return BaseFormField.SECRET.getFieldName();
    }

    public String getActivationCodeFormFieldName() {
        return BaseFormField.ACTIVATION_CODE.getFieldName();
    }

    public static boolean isStubSecurityRealm(@Nonnull SecurityRealmRegistration wrapper) {
        return StubSecurityRealmRegistration.class.equals(wrapper.getClass());
    }
}
