package com.infullmobile.jenkins.plugin.restrictedregister.verifiers;

import com.infullmobile.jenkins.plugin.restrictedregister.util.Utils;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.RegistrationRuleConfig;
import hudson.Extension;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.DataBoundSetter;
import org.kohsuke.stapler.export.Exported;

/**
 * Created by Adam Kobus on 27.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class SecretKeyConfig extends RegistrationRuleConfig {

    @DataBoundConstructor
    public SecretKeyConfig() {

    }

    private String secretKey;

    @DataBoundSetter
    public void setSecretKey(String value) {
        this.secretKey = Utils.fixEmptyString(value);
    }

    @Exported
    public String getSecretKey() {
        return secretKey;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + " : " + secretKey;
    }

    @Extension
    public static class SecretKeyConfigDescriptor extends DescriptorImpl {

        @Override
        public String getDisplayName() {
            return "Secret key authentication";
        }
    }
}
