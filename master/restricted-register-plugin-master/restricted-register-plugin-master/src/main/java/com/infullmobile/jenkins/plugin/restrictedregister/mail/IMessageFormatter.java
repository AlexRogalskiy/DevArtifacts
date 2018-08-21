package com.infullmobile.jenkins.plugin.restrictedregister.mail;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public abstract class IMessageFormatter {

    private final FormatterData formatterData = new FormatterData();

    public FormatterData getFormatterData() {
        return this.formatterData;
    }

    public final String formatMessage(String message) {
        return this.formatMessage(formatterData, message);
    }

    public abstract String formatMessage(FormatterData formatterData, String message);
}
