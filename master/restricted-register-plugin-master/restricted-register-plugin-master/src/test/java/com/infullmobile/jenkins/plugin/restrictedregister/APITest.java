package com.infullmobile.jenkins.plugin.restrictedregister;

import com.infullmobile.TestUtils;
import net.sf.json.JSONObject;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class APITest extends BaseTestClass {

    private enum ExpectedStatus {
        SUCCESS(API.JSON_STATUS_SUCCESS),
        ERROR(API.JSON_STATUS_ERROR);

        private String statusValue;

        ExpectedStatus(String statusValue) {
            this.statusValue = statusValue;
        }
    }

    @Rule
    public static final Timeout TIMEOUT = new Timeout(DEFAULT_TEST_TIMEOUT_MS);

    @Test
    public void testIsWellDefined() throws Exception {
        TestUtils.testIfUtilsClassIsWellDefined(API.class);
    }

    @Test
    public void success() throws Exception {
        final JSONObject object = API.success();
        testBasicJsonStructure(object, ExpectedStatus.SUCCESS);
    }

    @Test
    public void successWithDataParam() throws Exception {
        final JSONObject testData = new JSONObject();
        final String expectedKey = testUtils.getRandomShortString();
        final  String expectedValue = testUtils.getRandomMediumString();
        testData.put(expectedKey, expectedValue);
        final JSONObject object = API.success(testData);
        testBasicJsonStructure(object, ExpectedStatus.SUCCESS);
        final JSONObject data = getDataNode(object);
        Assert.assertTrue(data.has(expectedKey));
        Assert.assertEquals(expectedValue, data.getString(expectedKey));
    }

    @Test
    public void errorWithException() throws Exception {
        final String expectedMessage = testUtils.getRandomMediumString();
        final Exception exception = new Exception(expectedMessage);
        final JSONObject object = API.errorWithException(exception);
        testBasicJsonStructure(object, ExpectedStatus.ERROR);
        final JSONObject data = getDataNode(object);
        final String errorMessage = getDataErrorMessage(data);
        Assert.assertTrue(errorMessage.contains(expectedMessage));
    }

    @Test
    public void errorWithMessage() throws Exception {
        final String expectedMessage = testUtils.getRandomMediumString();
        final JSONObject object = API.errorWithMessage(expectedMessage);
        testBasicJsonStructure(object, ExpectedStatus.ERROR);
        final JSONObject data = getDataNode(object);
        final String errorMessage = getDataErrorMessage(data);
        Assert.assertTrue(errorMessage.contains(expectedMessage));
    }

    private void testBasicJsonStructure(JSONObject object, ExpectedStatus expectedStatus) throws Exception {
        Assert.assertNotNull(object);
        Assert.assertTrue(object.has(API.JSON_KEY_STATUS));
        Assert.assertTrue(object.has(API.JSON_KEY_DATA));
        final String status = object.getString(API.JSON_KEY_STATUS);
        Assert.assertEquals(expectedStatus.statusValue, status);
    }

    private JSONObject getDataNode(JSONObject object) {
        Assert.assertTrue(object.has(API.JSON_KEY_DATA));
        return (JSONObject) object.get(API.JSON_KEY_DATA);
    }

    private String getDataErrorMessage(JSONObject data) throws Exception {
        Assert.assertTrue(data.has(API.JSON_KEY_ERROR_DATA_MESSAGE));
        return data.getString(API.JSON_KEY_ERROR_DATA_MESSAGE);
    }
}