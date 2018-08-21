package com.infullmobile.jenkins.plugin.restrictedregister.module;

import hudson.model.Describable;
import hudson.model.Descriptor;
import hudson.security.SecurityRealm;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Map;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public interface IJenkinsDescriptor {
    @Nullable
    String getRootURL();

    @Nullable
    String getLoginURI();

    @Nonnull
    Map<String, String> getMasterEnvironmentVariables();

    @Nullable
    SecurityRealm getSecurityRealm();

    @Nonnull
    <E extends Describable<E>, T extends Descriptor<E>> T getDescriptorForType(E describable);

    @Nullable
    String getAdminEmail();
}
