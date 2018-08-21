package com.infullmobile.jenkins.plugin.restrictedregister;

import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.IPluginConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.util.SecretKeyChecker;
import hudson.Extension;
import hudson.model.UnprotectedRootAction;
import org.apache.commons.lang.StringUtils;

/**
 * Created by Adam Kobus on 30.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
@Extension
public class RestrictedRegistrationPlugin implements UnprotectedRootAction {

    public RestrictedRegistrationPlugin() {

    }

    // UnprotectedRootAction contract

    @Override
    public String getIconFileName() {
        return null;
    }

    @Override
    public String getDisplayName() {
        return PluginModule.getDefault().getPluginDescriptor().getRootActionDisplayName();
    }

    @Override
    public String getUrlName() {
        return PluginModule.getDefault().getPluginDescriptor().getRootActionURL();
    }

    @SuppressWarnings("unused")
    public boolean getEnabled() {
        return getConfig().getEnabled();
    }

    private IPluginConfig getConfig() {
        return PluginModule.getDefault().getPluginDescriptor().getGlobalConfig();
    }

    // Access and render

    public SecurityRealmRegistration getSecurityRealmRegistration() {
        return PluginModule.getDefault().getPluginDescriptor().getSecurityRealmRegistration();
    }

    @SuppressWarnings("unused")
    public boolean isValidState() {
        return StringUtils.isEmpty(getInvalidStateReason());
    }

    public String getInvalidStateReason() {
        String ret = "";
        if (!getEnabled()) {
            ret = "Registration is not enabled.";
        } else if (!SecretKeyChecker.isGetParamSecretValid()) {
            ret = "Unauthorized, secret key is invalid.";
        }
        return ret;
    }
}
