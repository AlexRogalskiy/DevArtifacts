package com.infullmobile.jenkins.plugin.restrictedregister;

import com.infullmobile.jenkins.plugin.restrictedregister.form.IFormField;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import javax.annotation.Nonnull;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Adam Kobus on 24.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class RegistrationException extends Exception {

    static final String JSON_KEY_FIELDS = "fields";

    private final Set<IFormField> affectedFields;

    public RegistrationException(String errorMessage) {
        super(errorMessage);
        this.affectedFields = createEmptyFieldsSet();
    }

    public RegistrationException(String errorMessage, IFormField... affectedFields) {
        super(errorMessage);
        if (affectedFields != null && affectedFields.length > 0) {
            this.affectedFields = createFieldsSetFrom(affectedFields);
        } else {
            this.affectedFields = createEmptyFieldsSet();
        }
    }

    private Set<IFormField> createEmptyFieldsSet() {
        return new HashSet<>();
    }

    private Set<IFormField> createFieldsSetFrom(IFormField... affectedFields) {
        final Collection<IFormField> fields = new ArrayList<>(affectedFields.length);
        Collections.addAll(fields, affectedFields);
        return new HashSet<>(fields);
    }

    @Nonnull
    JSONObject toJson() {
        final JSONObject ret = new JSONObject();
        ret.put(API.JSON_KEY_ERROR_DATA_MESSAGE, this.getLocalizedMessage());
        ret.put(RegistrationException.JSON_KEY_FIELDS, getFieldsJsonArray());
        return ret;
    }

    @Nonnull
    private JSONArray getFieldsJsonArray() {
        final JSONArray ret = new JSONArray();
        for (IFormField field : this.affectedFields) {
            ret.add(field.getFieldName());
        }
        return ret;
    }
}
