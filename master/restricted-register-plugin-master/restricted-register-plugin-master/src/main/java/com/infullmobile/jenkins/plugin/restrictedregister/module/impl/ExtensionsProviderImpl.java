package com.infullmobile.jenkins.plugin.restrictedregister.module.impl;

import com.infullmobile.jenkins.plugin.restrictedregister.ConfigurableDataVerifier;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.IMailMessageDecorator;
import com.infullmobile.jenkins.plugin.restrictedregister.module.IExtensionsProvider;
import com.infullmobile.jenkins.plugin.restrictedregister.security.SecurityRealmRegistration;

import javax.annotation.Nonnull;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class ExtensionsProviderImpl implements IExtensionsProvider {

    @Override
    public List<IMailMessageDecorator> getMailMessageDecorators() {
        return getExtensionsList(IMailMessageDecorator.class);
    }

    @Override
    public List<SecurityRealmRegistration> getSecurityRealmRegistrations() {
        return getExtensionsList(SecurityRealmRegistration.class);
    }

    @Override
    public List<ConfigurableDataVerifier> getConfigurableDataVerifiers() {
        return getExtensionsList(ConfigurableDataVerifier.class);
    }

    @Nonnull
    private <T> List<T> getExtensionsList(Class<T> type) {
        return new LinkedList<>(JenkinsDescriptorImpl.getJenkinsInstanceOrDie().getExtensionList(type));
    }
}
