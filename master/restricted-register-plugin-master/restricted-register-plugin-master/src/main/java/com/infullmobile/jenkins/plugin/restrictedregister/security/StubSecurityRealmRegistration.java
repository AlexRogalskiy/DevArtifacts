package com.infullmobile.jenkins.plugin.restrictedregister.security;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import hudson.Extension;
import hudson.model.Describable;
import hudson.model.Descriptor;
import hudson.security.SecurityRealm;

import javax.annotation.Nonnull;

/**
 * Created by Adam Kobus on 27.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class StubSecurityRealmRegistration extends SecurityRealmRegistration
        implements Describable<StubSecurityRealmRegistration> {

    public static final StubSecurityRealmRegistration INSTANCE = new StubSecurityRealmRegistration();

    private StubSecurityRealmRegistration() {

    }

    @Override
    public Descriptor<StubSecurityRealmRegistration> getDescriptor() {
        //noinspection unchecked
        return PluginModule.getDefault().getJenkinsDescriptor().getDescriptorForType(this);
    }

    @Override
    public boolean isRegistrationForSecurityRealm(SecurityRealm realm) {
        return false;
    }

    @Extension
    public static class StubSecurityRealmRegistrationDescriptor extends Descriptor<StubSecurityRealmRegistration> {

        @Nonnull
        @Override
        public String getDisplayName() {
            return "Stub security realm registration";
        }
    }
}
