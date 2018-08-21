package com.infullmobile.jenkins.plugin.restrictedregister.module;

import com.infullmobile.jenkins.plugin.restrictedregister.ConfigurableDataVerifier;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.IMailMessageDecorator;
import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;

import java.util.List;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public interface IExtensionsProvider {

    List<IMailMessageDecorator> getMailMessageDecorators();

    List<SecurityRealmRegistration> getSecurityRealmRegistrations();

    List<ConfigurableDataVerifier> getConfigurableDataVerifiers();
}
