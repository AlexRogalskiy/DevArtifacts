package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form;

import com.infullmobile.jenkins.plugin.restrictedregister.form.IFormField;
import net.sf.json.JSONObject;

import javax.annotation.Nullable;

/**
 * Created by Adam Kobus on 27.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public enum HudsonFormField implements IFormField {
    PASSWORD("rr_password"),
    PASSWORD_REPEAT("rr_password_repeat");

    private final String htmlFormFieldName;

    HudsonFormField(String htmlFormFieldName) {
        this.htmlFormFieldName = htmlFormFieldName;
    }

    @Override
    public String getFieldName() {
        return this.htmlFormFieldName;
    }

    @Nullable
    public static HudsonFormField fromJSFieldName(String name) {
        final HudsonFormField[] values = values();
        for (HudsonFormField field : values) {
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
