package com.infullmobile.mock;

import com.infullmobile.jenkins.plugin.restrictedregister.ConfigurableDataVerifier;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.IMailMessageDecorator;
import com.infullmobile.jenkins.plugin.restrictedregister.module.IExtensionsProvider;
import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;

import java.util.List;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class MockExtensionsProvider implements IExtensionsProvider {

    @Override
    public List<IMailMessageDecorator> getMailMessageDecorators() {
        return null;
    }

    @Override
    public List<SecurityRealmRegistration> getSecurityRealmRegistrations() {
        return null;
    }

    @Override
    public List<ConfigurableDataVerifier> getConfigurableDataVerifiers() {
        return null;
    }
}