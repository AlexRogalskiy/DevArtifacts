package com.infullmobile.jenkins.plugin.restrictedregister.module.impl;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.module.IPluginDescriptor;
import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.security.StubSecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.IPluginConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.ISecurityRealmRegistrationConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.PluginGlobalConfig;
import hudson.security.SecurityRealm;
import jenkins.model.GlobalConfiguration;
import jenkins.model.Jenkins;

import javax.annotation.Nonnull;
import java.util.List;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class PluginDescriptorImpl implements IPluginDescriptor {

    private static final String ACTION_URL = "restrictedRegister";
    private static final String ACTION_DISPLAY_NAME = "Registration";

    @Override
    public PluginGlobalConfig getGlobalConfig() {
        return GlobalConfiguration.all().get(PluginGlobalConfig.class);
    }

    @Nonnull
    @Override
    public String getRootActionDisplayName() {
        return ACTION_DISPLAY_NAME;
    }

    @Nonnull
    @Override
    public String getRootActionURL() {
        return ACTION_URL;
    }

    @Override
    @Nonnull
    public SecurityRealmRegistration getSecurityRealmRegistration() {
        final Jenkins jenkins = JenkinsDescriptorImpl.getJenkinsInstanceOrDie();
        final SecurityRealm realm = jenkins.getSecurityRealm();
        final List<SecurityRealmRegistration> allRegistrations = PluginModule.getDefault()
                .getExtensionsProvider().getSecurityRealmRegistrations();
        for (SecurityRealmRegistration instance : allRegistrations) {
            if (instance.isRegistrationForSecurityRealm(realm)) {
                return instance;
            }
        }
        return StubSecurityRealmRegistration.INSTANCE;
    }

    @Override
    public <T extends SecurityRealmRegistration> ISecurityRealmRegistrationConfig getConfigForSecurityRealmRegistration(
            Class<T> type) {
        final IPluginConfig pluginConfig = getGlobalConfig();
        for (ISecurityRealmRegistrationConfig config : pluginConfig.getRegistrationConfigurations()) {
            if (config.isConfigForSecurityRealmRegistration(type)) {
                return config;
            }
        }
        return null;
    }
}
