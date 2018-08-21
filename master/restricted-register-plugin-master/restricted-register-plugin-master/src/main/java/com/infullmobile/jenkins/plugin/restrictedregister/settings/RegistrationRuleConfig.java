package com.infullmobile.jenkins.plugin.restrictedregister.settings;

import hudson.model.AbstractDescribableImpl;
import hudson.model.Descriptor;

/**
 * Created by Adam Kobus on 27.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public abstract class RegistrationRuleConfig extends AbstractDescribableImpl<RegistrationRuleConfig> {

    public abstract static class DescriptorImpl extends Descriptor<RegistrationRuleConfig> {

    }
}
