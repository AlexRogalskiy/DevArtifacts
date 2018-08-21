package com.infullmobile.mock;

import com.infullmobile.jenkins.plugin.restrictedregister.settings.IPluginConfig;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.RegistrationRulesSet;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.RegistrationConfigCollection;

import java.util.List;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class MockPluginConfig implements IPluginConfig {

    @Override
    public String getAdminEmail() {
        return null;
    }

    @Override
    public String getReplyToEmail() {
        return null;
    }

    @Override
    public boolean getEnabled() {
        return false;
    }

    @Override
    public List<RegistrationRulesSet> getRulesList() {
        return null;
    }

    @Override
    public String getEmailFooter() {
        return null;
    }

    public RegistrationConfigCollection getRegistrationConfigurations() {
        return null;
    }
}
