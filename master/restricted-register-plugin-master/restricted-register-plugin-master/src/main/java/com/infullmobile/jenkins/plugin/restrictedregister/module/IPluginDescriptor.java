package com.infullmobile.jenkins.plugin.restrictedregister.module;

import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.IPluginConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.ISecurityRealmRegistrationConfig;

import javax.annotation.Nonnull;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public interface IPluginDescriptor {

    IPluginConfig getGlobalConfig();

    @Nonnull
    String getRootActionDisplayName();

    @Nonnull
    String getRootActionURL();

    @Nonnull
    SecurityRealmRegistration getSecurityRealmRegistration();

    <T extends SecurityRealmRegistration> ISecurityRealmRegistrationConfig getConfigForSecurityRealmRegistration(
            Class<T> type);
}
