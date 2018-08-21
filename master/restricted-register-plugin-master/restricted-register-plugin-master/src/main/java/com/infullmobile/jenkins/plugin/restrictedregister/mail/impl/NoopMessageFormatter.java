package com.infullmobile.jenkins.plugin.restrictedregister.mail.impl;

import com.infullmobile.jenkins.plugin.restrictedregister.mail.FormatterData;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.IMessageFormatter;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class NoopMessageFormatter extends IMessageFormatter {

    @Override
    public String formatMessage(FormatterData formatterData, String message) {
        return message;
    }
}
