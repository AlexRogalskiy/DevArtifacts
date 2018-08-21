package com.infullmobile.jenkins.plugin.restrictedregister.mail.data;

import com.infullmobile.jenkins.plugin.restrictedregister.BaseTestClass;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class FooterTest extends BaseTestClass {

    @Rule
    public static final Timeout TIMEOUT = new Timeout(DEFAULT_TEST_TIMEOUT_MS);

    @Test
    public void isEmpty() throws Exception {
        final String[] emptyStrings = new String[]{
                "",
                null,
        };
        for (String value : emptyStrings) {
            final Footer instance = new Footer(value);
            Assert.assertTrue(instance.isEmpty());
        }
        final String nonEmptyString = testUtils.getRandomShortString();
        final String[] nonEmptyStrings = new String[]{
                nonEmptyString,
                " ",
                "\n",
                "\t",
        };

        for (String value : nonEmptyStrings) {
            final Footer instance = new Footer(value);
            Assert.assertFalse(instance.isEmpty());
        }
    }

    @Test
    public void getContent() throws Exception {
        final String expectedContent = testUtils.getRandomMediumString();
        final Footer instance = new Footer(expectedContent);
        Assert.assertEquals(expectedContent, instance.getContent());
    }
}