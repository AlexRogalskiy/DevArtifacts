package com.infullmobile.jenkins.plugin.restrictedregister.mail.impl;

import com.infullmobile.jenkins.plugin.restrictedregister.mail.data.Footer;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.FormatterData;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.IMailMessageDecorator;
import hudson.Extension;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
@Extension
public class FooterDecorator implements IMailMessageDecorator {

    public static final int PRIORITY = -1000;
    private static final String NEWLINE = "<br>";

    @Override
    public String getTransformedMessage(FormatterData formatterData, String input) {
        final Footer footer = formatterData.getDataForType(Footer.class);
        final StringBuilder ret = new StringBuilder(input);
        if (!isFooterEmpty(footer)) {
            ret.append(NEWLINE);
            ret.append(footer.getContent());
        }
        return ret.toString();
    }

    private boolean isFooterEmpty(Footer footer) {
        return footer == null || footer.isEmpty();
    }

    @Override
    public int getPriority() {
        return PRIORITY;
    }
}
