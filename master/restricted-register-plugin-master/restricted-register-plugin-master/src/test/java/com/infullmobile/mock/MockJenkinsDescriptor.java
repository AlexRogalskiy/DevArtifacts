package com.infullmobile.mock;

import com.infullmobile.jenkins.plugin.restrictedregister.module.IJenkinsDescriptor;
import hudson.model.Describable;
import hudson.model.Descriptor;
import hudson.security.SecurityRealm;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class MockJenkinsDescriptor  implements IJenkinsDescriptor {

    public static final String EXPECTED_ROOT_URL = "http://testurl.com/";
    public static final String EXPECTED_LOGIN_URI = "login";

    private HashMap<String, String> envVariables = new HashMap<>();

    @Override
    public String getRootURL() {
        return EXPECTED_ROOT_URL;
    }

    @Override
    public String getLoginURI() {
        return EXPECTED_LOGIN_URI;
    }

    @Nonnull
    @Override
    public Map<String, String> getMasterEnvironmentVariables() {
        return envVariables;
    }

    @Override
    public SecurityRealm getSecurityRealm() {
        throw new UnsupportedOperationException("");
    }

    @Nonnull
    @Override
    public <E extends Describable<E>, T extends Descriptor<E>> T getDescriptorForType(E describable) {
        throw new UnsupportedOperationException("");
    }

    @Nullable
    @Override
    public String getAdminEmail() {
        throw new UnsupportedOperationException("");
    }

    public void putEnvVariable(String key, String value) {
        this.envVariables.put(key, value);
    }

    public void reset() {
        envVariables.clear();
    }
}