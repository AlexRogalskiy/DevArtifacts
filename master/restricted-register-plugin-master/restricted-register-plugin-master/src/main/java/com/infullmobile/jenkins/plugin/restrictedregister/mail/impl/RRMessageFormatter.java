package com.infullmobile.jenkins.plugin.restrictedregister.mail.impl;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.FormatterData;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.IMailMessageDecorator;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.IMessageFormatter;

import java.util.Collections;
import java.util.List;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class RRMessageFormatter extends IMessageFormatter {

    public RRMessageFormatter() {
        super();
        final FormatterData data = getFormatterData();
        data.addInputData(PluginModule.getDefault().getJenkinsDescriptor());
    }

    @Override
    public String formatMessage(FormatterData formatterData, String message) {
        final List<IMailMessageDecorator> messageDecorators = PluginModule.getDefault()
                .getExtensionsProvider().getMailMessageDecorators();
        Collections.sort(messageDecorators, IMailMessageDecorator.BY_PRIORITY_COMPARATOR_ASC);
        String ret = message;
        for (IMailMessageDecorator decorator : messageDecorators) {
            ret = decorator.getTransformedMessage(formatterData, ret);
        }
        return ret;
    }
}
