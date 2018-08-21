package com.infullmobile.jenkins.plugin.restrictedregister.mail.impl;

import com.infullmobile.jenkins.plugin.restrictedregister.BaseTestClass;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.FormatterData;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.data.Footer;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class FooterDecoratorTest extends BaseTestClass {

    @Rule
    public static final Timeout TIMEOUT = new Timeout(DEFAULT_TEST_TIMEOUT_MS);

    private final FooterDecorator instance = new FooterDecorator();

    @Test
    public void getTransformedMessageEmptyData() throws Exception {
        final String expected = testUtils.getRandomLongString();
        FormatterData formatterData = new FormatterData();
        String obtained = instance.getTransformedMessage(formatterData, expected);
        Assert.assertEquals(expected, obtained);

        // no action should be taken for empty footer
        formatterData.addInputData(new Footer(null));
        obtained = instance.getTransformedMessage(formatterData, expected);
        Assert.assertEquals(expected, obtained);

        formatterData = new FormatterData();
        formatterData.addInputData(new Footer(""));
        obtained = instance.getTransformedMessage(formatterData, expected);
        Assert.assertEquals(expected, obtained);
    }

    @Test
    public void getTransformedMessage() throws Exception {
        final String messageContent = testUtils.getRandomLongString();
        final String footerContent = testUtils.getRandomLongString();

        final Footer footer = new Footer(footerContent);
        final FormatterData formatterData = new FormatterData();
        formatterData.addInputData(footer);
        final String obtained = instance.getTransformedMessage(formatterData, messageContent);

        Assert.assertNotNull(obtained);
        Assert.assertTrue(obtained.startsWith(messageContent));
        Assert.assertTrue(obtained.endsWith(footerContent));
    }

    @Test
    public void getPriority() throws Exception {
        // just checking if no exception is thrown
        final int priority = instance.getPriority();
        Assert.assertEquals(FooterDecorator.PRIORITY, priority);
    }
}