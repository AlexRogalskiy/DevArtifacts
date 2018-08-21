package com.infullmobile.jenkins.plugin.restrictedregister.mail.impl;

import com.infullmobile.jenkins.plugin.restrictedregister.BaseTestClass;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.FormatterData;
import com.infullmobile.mock.MockJenkinsDescriptor;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.Locale;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class EnvVariablesDecoratorTest extends BaseTestClass {

    private static final String TEST_KEY = "key";
    // this key shouldn't be replaced / removed from formatted message
    private static final String UNMODIFIED_KEY = "${foo}";
    private static final String TEST_FORMAT = String.format(Locale.US, "My test ${%s}%n%s ${bar ${%s}}",
            TEST_KEY, UNMODIFIED_KEY, TEST_KEY);

    // second key occurrence shouldn't be replaced, since it resides inside ${bar }
    private static final String EXPECTED_FORMAT = "My test %s%n" + UNMODIFIED_KEY + " ${bar ${" + TEST_KEY + "}}";

    private final EnvVariablesDecorator instance = new EnvVariablesDecorator();

    @Rule
    public static final Timeout TIMEOUT = new Timeout(DEFAULT_TEST_TIMEOUT_MS);

    @Test
    public void getTransformedMessageEmptyData() throws Exception {
        final String expected = TEST_FORMAT;
        final String obtained = instance.getTransformedMessage(new FormatterData(), TEST_FORMAT);
        Assert.assertEquals(expected, obtained);
    }

    @Test
    public void getTransformedMessage() throws Exception {
        final MockJenkinsDescriptor descriptor = mockPluginModule.getMockJenkinsDescriptor();
        final FormatterData data = new FormatterData();
        data.addInputData(descriptor);

        final String expectedValue = testUtils.getRandomShortString();
        descriptor.putEnvVariable(TEST_KEY, expectedValue);

        final String obtained = instance.getTransformedMessage(data, TEST_FORMAT);
        final String expected = String.format(Locale.US, EXPECTED_FORMAT, expectedValue);
        Assert.assertNotNull(obtained);
        Assert.assertEquals(expected, obtained);
    }

    @Test
    public void getPriority() throws Exception {
        // just checking if no exception is thrown
        final int priority = instance.getPriority();
        Assert.assertEquals(EnvVariablesDecorator.PRIORITY_DEFAULT, priority);
    }
}