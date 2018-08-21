package com.infullmobile.jenkins.plugin.restrictedregister.settings;

import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;
import hudson.model.AbstractDescribableImpl;
import hudson.model.Descriptor;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public abstract class ISecurityRealmRegistrationConfig extends
        AbstractDescribableImpl<ISecurityRealmRegistrationConfig> {

    public abstract <E extends SecurityRealmRegistration> boolean isConfigForSecurityRealmRegistration(Class<E> type);

    public abstract static class IRegistrationConfigDescriptor extends Descriptor<ISecurityRealmRegistrationConfig> {

        public IRegistrationConfigDescriptor() {
            super();
        }

        @SuppressWarnings("unused")
        public IRegistrationConfigDescriptor(Class<? extends ISecurityRealmRegistrationConfig> type) {
            super(type);
        }
    }
}
