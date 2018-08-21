package com.infullmobile.jenkins.plugin.restrictedregister.util;

import com.infullmobile.jenkins.plugin.restrictedregister.BaseTestClass;
import com.infullmobile.jenkins.plugin.restrictedregister.form.BaseFormField;
import com.infullmobile.mock.MockJenkinsDescriptor;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.net.URL;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class AppUrlsTest extends BaseTestClass {

    @Rule
    public static final Timeout TIMEOUT = new Timeout(DEFAULT_TEST_TIMEOUT_MS);

    @Test
    public void buildActivationUrl() throws Exception {
        final String expectedCode = testUtils.getRandomMediumString();
        final String expectedSecret = testUtils.getRandomMediumString();

        final String obtainedURL = AppUrls.buildActivationUrl(expectedCode, expectedSecret);
        Assert.assertNotNull(obtainedURL);
        Assert.assertTrue(obtainedURL.length() > 0);

        final URL url = new URL(obtainedURL);

        final String query = url.getQuery();
        Assert.assertTrue(query.contains(expectedCode));
        Assert.assertTrue(query.contains(expectedSecret));

        Assert.assertTrue(query.contains(BaseFormField.SECRET.getFieldName()));
        Assert.assertTrue(query.contains(BaseFormField.ACTIVATION_CODE.getFieldName()));

        final String expectedRootURL = getFixedRootURL(MockJenkinsDescriptor.EXPECTED_ROOT_URL);
        Assert.assertTrue(obtainedURL.startsWith(expectedRootURL));
    }

    private String getFixedRootURL(String url) {
        if (url.endsWith("/")) {
            return url.substring(0, url.length() - 1);
        }
        return url;
    }
}