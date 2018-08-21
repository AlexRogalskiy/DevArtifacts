package com.infullmobile.mock;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.module.IExtensionsProvider;
import com.infullmobile.jenkins.plugin.restrictedregister.module.IJenkinsDescriptor;
import com.infullmobile.jenkins.plugin.restrictedregister.module.IPluginDescriptor;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class MockPluginModule extends PluginModule {

    private final MockJenkinsDescriptor jenkinsDescriptor = new MockJenkinsDescriptor();
    private final MockExtensionsProvider extensionsProvider = new MockExtensionsProvider();
    private final MockPluginDescriptor pluginDescriptor = new MockPluginDescriptor();

    public void inject() {
        PluginModule.setDefault(this);
    }

    public void restoreDefault() {
        PluginModule.setDefault(null);
    }

    @Override
    public IJenkinsDescriptor getJenkinsDescriptor() {
        return getMockJenkinsDescriptor();
    }

    @Override
    public IExtensionsProvider getExtensionsProvider() {
        return getMockExtensionsProvider();
    }

    @Override
    public IPluginDescriptor getPluginDescriptor() {
        return getMockPluginDescriptor();
    }

    public MockExtensionsProvider getMockExtensionsProvider() {
        return extensionsProvider;
    }

    public MockJenkinsDescriptor getMockJenkinsDescriptor() {
        return jenkinsDescriptor;
    }

    public MockPluginDescriptor getMockPluginDescriptor() {
        return pluginDescriptor;
    }
}
