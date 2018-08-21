package com.infullmobile.jenkins.plugin.restrictedregister.module.impl;

import com.infullmobile.jenkins.plugin.restrictedregister.module.IJenkinsDescriptor;
import hudson.EnvVars;
import hudson.model.Describable;
import hudson.model.Descriptor;
import hudson.security.SecurityRealm;
import jenkins.model.Jenkins;
import jenkins.model.JenkinsLocationConfiguration;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class JenkinsDescriptorImpl implements IJenkinsDescriptor {

    @Nullable
    @Override
    public String getRootURL() {
        return getJenkinsInstanceOrDie().getRootUrl();
    }

    @Nullable
    @Override
    public String getLoginURI() {
        return getJenkinsInstanceOrDie().getSecurityRealm().getLoginUrl();
    }

    @Nonnull
    @Override
    public Map<String, String> getMasterEnvironmentVariables() {
        return new HashMap<>(EnvVars.masterEnvVars);
    }

    @Nullable
    @Override
    public SecurityRealm getSecurityRealm() {
        return getJenkinsInstanceOrDie().getSecurityRealm();
    }

    @Nonnull
    @Override
    public <E extends Describable<E>, T extends Descriptor<E>> T getDescriptorForType(E describable) {
        //noinspection unchecked
        return (T) getJenkinsInstanceOrDie().getDescriptor(describable.getClass());
    }

    @Nullable
    @Override
    public String getAdminEmail() {
        final JenkinsLocationConfiguration locationConfiguration = JenkinsLocationConfiguration.get();
        if (locationConfiguration != null) {
            return locationConfiguration.getAdminAddress();
        }
        return null;
    }

    @Nonnull
    public static Jenkins getJenkinsInstanceOrDie() {
        final Jenkins jenkins = Jenkins.getInstance();
        assert jenkins != null;
        return jenkins;
    }
}
