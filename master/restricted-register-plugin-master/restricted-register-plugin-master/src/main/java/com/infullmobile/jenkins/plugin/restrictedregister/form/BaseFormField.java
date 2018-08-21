package com.infullmobile.jenkins.plugin.restrictedregister.form;

import net.sf.json.JSONObject;

import javax.annotation.Nullable;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public enum BaseFormField implements IFormField {
    USERNAME("rr_username"),
    EMAIL("rr_email"),
    DISPLAY_NAME("rr_display_name"),
    SECRET("rr_secret"),
    ACTIVATION_CODE("rr_code");

    private final String htmlFormFieldName;

    BaseFormField(String htmlFormFieldName) {
        this.htmlFormFieldName = htmlFormFieldName;
    }

    @Override
    public String getFieldName() {
        return this.htmlFormFieldName;
    }

    @Nullable
    public static BaseFormField fromJSFieldName(String name) {
        final BaseFormField[] values = values();
        for (BaseFormField field : values) {
            if (field.htmlFormFieldName.equals(name)) {
                return field;
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    public <T> T fromJSON(JSONObject object) {
        if (object.has(getFieldName())) {
            return (T) object.get(getFieldName());
        } else {
            return null;
        }
    }
}
