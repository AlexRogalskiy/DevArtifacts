package com.infullmobile.jenkins.plugin.restrictedregister.form;

import com.infullmobile.jenkins.plugin.restrictedregister.BaseTestClass;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Adam Kobus on 30.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class BaseFormFieldTest extends BaseTestClass {

    @Rule
    public static final Timeout TIMEOUT = new Timeout(DEFAULT_TEST_TIMEOUT_MS);

    @Test
    public void getFieldName() throws Exception {
        final List<String> fields = new LinkedList<>();
        final BaseFormField[] hudsonFormFields = BaseFormField.values();
        for (BaseFormField field : hudsonFormFields) {
            final String jsFieldValue = field.getFieldName();
            // checking if field name is not empty
            Assert.assertNotNull(jsFieldValue);
            Assert.assertTrue(jsFieldValue.length() > 0);
            // checking if all fields are unique
            Assert.assertFalse(fields.contains(jsFieldValue));
            fields.add(jsFieldValue);
        }
    }

    @Test
    public void fromJSFieldName() throws Exception {
        final List<BaseFormField> expectedFields = new LinkedList<>();
        Collections.addAll(expectedFields, BaseFormField.values());

        final String[] fieldNames = new String[expectedFields.size()];
        for (int i = 0; i < fieldNames.length; i++) {
            fieldNames[i] = expectedFields.get(i).getFieldName();
        }

        final List<BaseFormField> obtainedFields = new LinkedList<>();
        for (String fieldName : fieldNames) {
            obtainedFields.add(BaseFormField.fromJSFieldName(fieldName));
        }

        Assert.assertEquals(expectedFields.size(), obtainedFields.size());
        for (BaseFormField field : obtainedFields) {
            Assert.assertNotNull(field);
            Assert.assertTrue(expectedFields.contains(field));
        }
    }

    @Test
    public void fromJSFieldNameEdgeCases() throws Exception {
        BaseFormField field = BaseFormField.fromJSFieldName(null);
        Assert.assertNull(field);

        final BaseFormField[] allFields = BaseFormField.values();
        final List<String> fieldNames = new LinkedList<>();
        for (BaseFormField hudsonFormField : allFields) {
            fieldNames.add(hudsonFormField.getFieldName());
        }
        String nonExistingFieldName;
        do {
            nonExistingFieldName = testUtils.getRandomShortString();
        } while (fieldNames.contains(nonExistingFieldName));

        field = BaseFormField.fromJSFieldName(nonExistingFieldName);
        Assert.assertNull(field);
    }
}