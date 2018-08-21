package com.infullmobile.jenkins.plugin.restrictedregister.mail.impl;

import com.infullmobile.jenkins.plugin.restrictedregister.mail.FormatterData;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.IMailMessageDecorator;
import com.infullmobile.jenkins.plugin.restrictedregister.module.IJenkinsDescriptor;
import hudson.Extension;
import org.apache.commons.lang.text.StrSubstitutor;

import java.util.Map;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
@Extension
public class EnvVariablesDecorator implements IMailMessageDecorator {

    @Override
    public String getTransformedMessage(FormatterData formatterData, String input) {
        final IJenkinsDescriptor jenkinsDescriptor = formatterData.getDataForType(IJenkinsDescriptor.class);
        if (jenkinsDescriptor != null) {
            final Map<String, String> vars = jenkinsDescriptor.getMasterEnvironmentVariables();
            final StrSubstitutor strSubstitutor = new StrSubstitutor(vars);
            return strSubstitutor.replace(input);
        } else {
            return input;
        }
    }

    @Override
    public int getPriority() {
        return PRIORITY_DEFAULT;
    }
}
