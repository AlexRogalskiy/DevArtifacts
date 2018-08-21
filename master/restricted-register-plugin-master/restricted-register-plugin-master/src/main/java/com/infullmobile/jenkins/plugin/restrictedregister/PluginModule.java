package com.infullmobile.jenkins.plugin.restrictedregister;

import com.infullmobile.jenkins.plugin.restrictedregister.module.IExtensionsProvider;
import com.infullmobile.jenkins.plugin.restrictedregister.module.IJenkinsDescriptor;
import com.infullmobile.jenkins.plugin.restrictedregister.module.IPluginDescriptor;
import com.infullmobile.jenkins.plugin.restrictedregister.module.impl.ExtensionsProviderImpl;
import com.infullmobile.jenkins.plugin.restrictedregister.module.impl.JenkinsDescriptorImpl;
import com.infullmobile.jenkins.plugin.restrictedregister.module.impl.PluginDescriptorImpl;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public abstract class PluginModule {

    private static final PluginModule DEFAULT = new DefaultModuleImpl();

    private static PluginModule instance;

    static {
        setDefault(null);
    }

    public static PluginModule getDefault() {
        synchronized (PluginModule.class) {
            return instance;
        }
    }

    public static void setDefault(PluginModule module) {
        synchronized (PluginModule.class) {
            if (module == null) {
                instance = DEFAULT;
            } else {
                instance = module;
            }
        }
    }

    // Factory methods

    public abstract IJenkinsDescriptor getJenkinsDescriptor();

    public abstract IExtensionsProvider getExtensionsProvider();

    public abstract IPluginDescriptor getPluginDescriptor();

    // Default impl

    private static class DefaultModuleImpl extends PluginModule {

        private final IJenkinsDescriptor jenkinsDescriptor = new JenkinsDescriptorImpl();
        private final IExtensionsProvider extensionsProvider = new ExtensionsProviderImpl();
        private final IPluginDescriptor pluginDescriptor = new PluginDescriptorImpl();

        @Override
        public IJenkinsDescriptor getJenkinsDescriptor() {
            return jenkinsDescriptor;
        }

        @Override
        public IExtensionsProvider getExtensionsProvider() {
            return extensionsProvider;
        }

        @Override
        public IPluginDescriptor getPluginDescriptor() {
            return pluginDescriptor;
        }
    }
}
