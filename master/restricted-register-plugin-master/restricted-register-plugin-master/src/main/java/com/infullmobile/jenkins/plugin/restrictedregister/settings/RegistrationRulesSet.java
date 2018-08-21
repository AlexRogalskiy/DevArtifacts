package com.infullmobile.jenkins.plugin.restrictedregister.settings;

import com.infullmobile.jenkins.plugin.restrictedregister.ConfigurableDataVerifier;
import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.module.impl.JenkinsDescriptorImpl;
import com.infullmobile.jenkins.plugin.restrictedregister.util.Utils;
import hudson.DescriptorExtensionList;
import hudson.Extension;
import hudson.model.AbstractDescribableImpl;
import hudson.model.Descriptor;
import hudson.util.FormValidation;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.kohsuke.stapler.DataBoundConstructor;
import org.kohsuke.stapler.DataBoundSetter;
import org.kohsuke.stapler.QueryParameter;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Adam Kobus on 25.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class RegistrationRulesSet extends AbstractDescribableImpl<RegistrationRulesSet> {

    private String ruleName;
    private List<RegistrationRuleConfig> configs;

    @DataBoundConstructor
    public RegistrationRulesSet() {

    }

    public boolean isUserDataValid(JSONObject payload) {
        final List<ConfigurableDataVerifier> verifiers = PluginModule.getDefault()
                .getExtensionsProvider().getConfigurableDataVerifiers();
        for (ConfigurableDataVerifier verifier : verifiers) {
            if (!validateDataWithVerifier(payload, verifier)) {
                return false;
            }
        }
        return true;
    }

    public boolean validateDataWithVerifier(JSONObject payload, ConfigurableDataVerifier verifier) {
        final RegistrationRuleConfig config = getConfigForVerifier(verifier);
        return config == null || verifier.isFormDataValid(payload, config);
    }

    // Access and render

    @DataBoundSetter
    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    @SuppressWarnings("unused")
    public String getRuleName() {
        return this.ruleName;
    }

    @DataBoundSetter
    public void setConfigs(List<RegistrationRuleConfig> configs) {
        if (this.configs == null) {
            this.configs = new LinkedList<>();
        }
        this.configs.clear();
        if (configs != null) {
            this.configs.addAll(configs);
        }
    }

    @SuppressWarnings("WeakerAccess")
    public List<RegistrationRuleConfig> getConfigs() {
        if (this.configs == null) {
            configs = new LinkedList<>();
        }
        return this.configs;
    }

    @Nullable
    private RegistrationRuleConfig getConfigForVerifier(ConfigurableDataVerifier verifier) {
        for (RegistrationRuleConfig config : getConfigs()) {
            if (verifier.isConfigTypeValid(config)) {
                return config;
            }
        }
        return null;
    }

    @Extension
    public static class RegistrationRulesSetDescriptor extends Descriptor<RegistrationRulesSet> {

        @Nonnull
        @Override
        public String getDisplayName() {
            return Utils.getDescriptorDisplayName(this);
        }

        // Access and render

        @SuppressWarnings("unused")
        public DescriptorExtensionList<RegistrationRuleConfig,
                Descriptor<RegistrationRuleConfig>> getConfigDescriptors() {
            return JenkinsDescriptorImpl.getJenkinsInstanceOrDie().getDescriptorList(RegistrationRuleConfig.class);
        }

        // Validation

        @SuppressWarnings("unused")
        public FormValidation doCheckRuleName(@QueryParameter String value) {
            if (StringUtils.isEmpty(value)) {
                return FormValidation.error("Rule name cannot be empty.");
            } else {
                return FormValidation.ok();
            }
        }
    }
}
