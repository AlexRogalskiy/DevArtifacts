package com.infullmobile.jenkins.plugin.restrictedregister.settings;

import java.util.List;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public interface IPluginConfig {

    String getAdminEmail();

    String getReplyToEmail();

    boolean getEnabled();

    List<RegistrationRulesSet> getRulesList();

    String getEmailFooter();

    RegistrationConfigCollection getRegistrationConfigurations();
}
