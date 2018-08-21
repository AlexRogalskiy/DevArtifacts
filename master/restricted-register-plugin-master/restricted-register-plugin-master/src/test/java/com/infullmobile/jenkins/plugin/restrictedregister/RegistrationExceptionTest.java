package com.infullmobile.jenkins.plugin.restrictedregister;

import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.form.HudsonFormField;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.ArrayList;

/**
 * Created by Adam Kobus on 25.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class RegistrationExceptionTest extends BaseTestClass {

    @Rule
    public static final Timeout TIMEOUT = new Timeout(DEFAULT_TEST_TIMEOUT_MS);

    @Test
    public void testInit() throws Exception {
        String expectedMessage = generateRandomString();
        RegistrationException exception = new RegistrationException(expectedMessage);
        Assert.assertEquals(expectedMessage, exception.getMessage());

        expectedMessage = generateRandomString();
        exception = new RegistrationException(expectedMessage, BaseFormField.USERNAME);
        Assert.assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    public void toJsonNoFields() throws Exception {
        final String expectedMessage = generateRandomString();
        final RegistrationException exception = new RegistrationException(expectedMessage);
        final JSONObject jsonObject = exception.toJson();
        Assert.assertEquals(expectedMessage, jsonObject.getString(API.JSON_KEY_ERROR_DATA_MESSAGE));
        final JSONArray fields = jsonObject.getJSONArray(RegistrationException.JSON_KEY_FIELDS);
        Assert.assertEquals(0, fields.size());
    }

    @Test
    public void toJsonWithFields() throws Exception {
        final HudsonFormField[] availableFields = HudsonFormField.values();
        final ArrayList<HudsonFormField> expectedFieldsList = new ArrayList<>(availableFields.length);
        for (HudsonFormField field : availableFields) {
            if (testUtils.rnd.nextBoolean()) {
                expectedFieldsList.add(field);
            }
        }

        final HudsonFormField[] expectedFields = new HudsonFormField[expectedFieldsList.size()];
        expectedFieldsList.toArray(expectedFields);
        final String expectedMessage = generateRandomString();

        final RegistrationException exception = new RegistrationException(expectedMessage, expectedFields);
        final JSONObject jsonObject = exception.toJson();
        Assert.assertEquals(expectedMessage, jsonObject.getString(API.JSON_KEY_ERROR_DATA_MESSAGE));
        final JSONArray fields = jsonObject.getJSONArray(RegistrationException.JSON_KEY_FIELDS);
        Assert.assertEquals(expectedFields.length, fields.size());
        final ArrayList<HudsonFormField> obtainedFieldsList = new ArrayList<>(fields.size());

        final int fieldsCount = fields.size();
        for (int i = 0; i < fieldsCount; i++) {
            final String jsFieldName = fields.getString(i);
            final HudsonFormField field = HudsonFormField.fromJSFieldName(jsFieldName);
            Assert.assertNotNull("Field enum returned null when looking for field with js name " + jsFieldName, field);
            obtainedFieldsList.add(field);
        }

        for (HudsonFormField field : expectedFieldsList) {
            Assert.assertTrue("Field " + field.getFieldName() + " wasn't found in generated JSON object",
                    obtainedFieldsList.contains(field));
        }
    }

    private String generateRandomString() {
        return testUtils.getRandomShortString();
    }
}