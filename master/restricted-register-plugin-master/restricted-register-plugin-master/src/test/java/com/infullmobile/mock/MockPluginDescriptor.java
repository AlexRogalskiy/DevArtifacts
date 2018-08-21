package com.infullmobile.mock;

import com.infullmobile.jenkins.plugin.restrictedregister.module.IPluginDescriptor;
import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.IPluginConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.ISecurityRealmRegistrationConfig;

import javax.annotation.Nonnull;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class MockPluginDescriptor implements IPluginDescriptor {

    public static final String EXPECTED_ACTION_URL = "restrictedRegister";

    private final MockPluginConfig config = new MockPluginConfig();

    @Override
    public IPluginConfig getGlobalConfig() {
        return config;
    }

    @Nonnull
    @Override
    public String getRootActionDisplayName() {
        throw new UnsupportedOperationException("");
    }

    @Nonnull
    @Override
    public String getRootActionURL() {
        return EXPECTED_ACTION_URL;
    }

    @Nonnull
    @Override
    public SecurityRealmRegistration getSecurityRealmRegistration() {
        throw new UnsupportedOperationException("");
    }

    @Override
    public <T extends SecurityRealmRegistration> ISecurityRealmRegistrationConfig
    getConfigForSecurityRealmRegistration(Class<T> type) {
        throw new UnsupportedOperationException("");
    }
}
