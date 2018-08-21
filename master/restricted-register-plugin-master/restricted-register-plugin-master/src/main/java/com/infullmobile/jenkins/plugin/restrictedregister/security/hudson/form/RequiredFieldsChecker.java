package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form;

import com.infullmobile.jenkins.plugin.restrictedregister.RegistrationException;
import com.infullmobile.jenkins.plugin.restrictedregister.form.IFormField;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Adam Kobus on 01.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class RequiredFieldsChecker {

    private RequiredFieldsChecker() {

    }

    public static void checkRequiredFields(JSONObject payload, IFormField... requiredFields)
            throws RegistrationException {
        final List<IFormField> emptyFields = new ArrayList<>();
        for (IFormField field : requiredFields) {
            if (!payload.has(field.getFieldName()) ||
                    StringUtils.isEmpty(payload.getString(field.getFieldName()))) {
                emptyFields.add(field);
            }
        }
        if (!emptyFields.isEmpty()) {
            throw new RegistrationException("One or more field is empty.",
                    emptyFields.toArray(new IFormField[emptyFields.size()]));
        }
    }
}
