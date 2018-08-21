package com.infullmobile.jenkins.plugin.restrictedregister.settings;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.util.DescribableCollection;
import hudson.Extension;
import hudson.model.Descriptor;
import org.kohsuke.stapler.DataBoundConstructor;

import javax.annotation.Nonnull;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class RegistrationConfigCollection extends DescribableCollection<ISecurityRealmRegistrationConfig,
        RegistrationConfigCollection> {

    @SuppressWarnings({"unused", "WeakerAccess"})
    @DataBoundConstructor
    public RegistrationConfigCollection() {

    }

    @Override
    public Descriptor<RegistrationConfigCollection> getDescriptor() {
        return PluginModule.getDefault().getJenkinsDescriptor().getDescriptorForType(this);
    }

    @Extension
    public static class RegistrationConfigCollectionDescriptor extends Descriptor<RegistrationConfigCollection> {

        @Nonnull
        @Override
        public String getDisplayName() {
            return "Per-security realm configurations";
        }
    }
}
