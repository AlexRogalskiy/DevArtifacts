package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.config;

import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.ISecurityRealmRegistrationConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.HudsonSecurityRealmRegistration;
import hudson.Extension;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.DataBoundSetter;

import javax.annotation.Nonnull;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
@Extension
public class RegistrationConfigImpl extends ISecurityRealmRegistrationConfig {

    private String confirmationEmailSubject;
    private String confirmationEmailContent;

    private String welcomeEmailSubject;
    private String welcomeEmailContent;

    @DataBoundConstructor
    public RegistrationConfigImpl() {

    }

    public String getConfirmationEmailSubject() {
        return confirmationEmailSubject;
    }

    @DataBoundSetter
    public void setConfirmationEmailSubject(String confirmationEmailSubject) {
        this.confirmationEmailSubject = confirmationEmailSubject;
    }

    public String getConfirmationEmailContent() {
        return confirmationEmailContent;
    }

    @DataBoundSetter
    public void setConfirmationEmailContent(String confirmationEmailContent) {
        this.confirmationEmailContent = confirmationEmailContent;
    }

    public String getWelcomeEmailSubject() {
        return welcomeEmailSubject;
    }

    @DataBoundSetter
    public void setWelcomeEmailSubject(String welcomeEmailSubject) {
        this.welcomeEmailSubject = welcomeEmailSubject;
    }

    public String getWelcomeEmailContent() {
        return welcomeEmailContent;
    }

    @DataBoundSetter
    public void setWelcomeEmailContent(String welcomeEmailContent) {
        this.welcomeEmailContent = welcomeEmailContent;
    }

    // ISecurityRealmRegistrationConfig contract

    @Override
    public <E extends SecurityRealmRegistration> boolean isConfigForSecurityRealmRegistration(Class<E> type) {
        return HudsonSecurityRealmRegistration.class.equals(type);
    }

    @Extension
    public static class DescriptorImpl extends IRegistrationConfigDescriptor {

        @Nonnull
        @Override
        public String getDisplayName() {
            return "Jenkins' own user database";
        }
    }
}
