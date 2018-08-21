package com.infullmobile.jenkins.plugin.restrictedregister.settings;

import com.infullmobile.jenkins.plugin.restrictedregister.module.impl.JenkinsDescriptorImpl;
import hudson.DescriptorExtensionList;
import hudson.Extension;
import jenkins.model.GlobalConfiguration;
import jenkins.model.GlobalConfigurationCategory;
import net.sf.json.JSONObject;
import org.kohsuke.stapler.DataBoundSetter;
import org.kohsuke.stapler.StaplerRequest;

import java.util.LinkedList;
import java.util.List;

/**
 * Created by Adam Kobus on 24.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 * Implemented according to https://wiki.jenkins-ci.org/display/JENKINS/Manage+global+settings+and+tools+installations
 */
@Extension
public class PluginGlobalConfig extends GlobalConfiguration implements IPluginConfig {

    // should have same value as the name of root section in corresponding config.jelly file
    private static final String NAMESPACE = "restricted-register";

    // should have exact same name as field storing rule sets list
    private static final String JSON_KEY_RULES_LIST = "rulesList";

    private boolean enabled;
    private String adminEmail;
    private List<RegistrationRulesSet> rulesList;

    private String emailFooter;
    private RegistrationConfigCollection registrationConfigurations;
    private String replyToEmail;

    public PluginGlobalConfig() {
        super();
        if (getConfigFile().exists()) {
            load();
        } else {
            save();
        }
    }

    // Access and render

    @DataBoundSetter
    public void setEnabled(boolean value) {
        this.enabled = value;
    }

    @Override
    public boolean getEnabled() {
        return this.enabled;
    }

    @DataBoundSetter
    public void setRulesList(List<RegistrationRulesSet> value) {
        this.getRulesList().clear();
        if (value != null) {
            this.getRulesList().addAll(value);
        }
    }

    @Override
    public List<RegistrationRulesSet> getRulesList() {
        if (rulesList == null) {
            rulesList = new LinkedList<>();
        }
        return rulesList;
    }

    @Override
    public String getAdminEmail() {
        return this.adminEmail;
    }

    @DataBoundSetter
    public void setAdminEmail(String value) {
        this.adminEmail = value;
    }

    @Override
    public String getReplyToEmail() {
        return this.replyToEmail;
    }

    @DataBoundSetter
    public void setReplyToEmail(String value) {
        this.replyToEmail = value;
    }

    @Override
    public String getEmailFooter() {
        return emailFooter;
    }


    @DataBoundSetter
    public void setEmailFooter(String emailFooter) {
        this.emailFooter = emailFooter;
    }

    public RegistrationConfigCollection getRegistrationConfigurations() {
        if (registrationConfigurations == null) {
            registrationConfigurations = new RegistrationConfigCollection();
        }
        return registrationConfigurations;
    }

    @DataBoundSetter
    public void setRegistrationConfigurations(RegistrationConfigCollection values) {
        getRegistrationConfigurations().clear();
        getRegistrationConfigurations().addAll(values);
    }

    @SuppressWarnings("unused")
    public DescriptorExtensionList getRegistrationConfigDescriptors() {
        //noinspection ConstantConditions
        return JenkinsDescriptorImpl.getJenkinsInstanceOrDie().getDescriptorList(
                ISecurityRealmRegistrationConfig.class);
    }

    // GlobalConfiguration contract

    @Override
    public GlobalConfigurationCategory getCategory() {
        return GlobalConfigurationCategory.get(GlobalConfigurationCategory.Security.class);
    }

    @Override
    public boolean configure(StaplerRequest req, JSONObject json) throws FormException {
        final JSONObject rootNode = json.getJSONObject(NAMESPACE);
        req.bindJSON(this, rootNode);

        applyEmptyRulesListWorkaroundIfNeeded(rootNode);

        save();
        return true;
    }

    /**
     * When user deletes all of the rule sets, then json payload won't contain rules list array node at all.
     * Because of that, the list present in this class won't be updated during save();
     * <p>
     * From the user perspective, it would mean that rule sets, which were just deleted,
     * remain unchanged in config page.
     * <p>
     * Workaround for this scenario is to check for existence of this node manually
     * and clear rule set list when node is not present.
     */
    private void applyEmptyRulesListWorkaroundIfNeeded(JSONObject rootNode) {
        if (!rootNode.has(JSON_KEY_RULES_LIST)) {
            setRulesList(null);
        }
    }
}
