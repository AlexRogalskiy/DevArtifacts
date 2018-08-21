package com.infullmobile.jenkins.plugin.restrictedregister.util;

import com.infullmobile.ExpectedDate;
import com.infullmobile.TestLogHandler;
import com.infullmobile.TestUtils;
import com.infullmobile.jenkins.plugin.restrictedregister.BaseTestClass;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.Locale;
import java.util.logging.Level;

/**
 * Created by Adam Kobus on 24.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class UtilsTest extends BaseTestClass {

    private static final int TEST_REPEAT_COUNT = 50;

    private static TestLogHandler logHandler;
    private static boolean useParentHandlersValue;

    @Rule
    public static final Timeout TIMEOUT = new Timeout(DEFAULT_TEST_TIMEOUT_MS);

    private static final String EXPECTED_TIMESTAMP_FORMAT = "%04d-%02d-%02d %02d:%02d:%02d";

    @SuppressWarnings("unused")
    @BeforeClass
    public static void setUpClass() {
        logHandler = new TestLogHandler();

        // silencing default log output
        useParentHandlersValue = Utils.LOGGER.getUseParentHandlers();
        Utils.LOGGER.setUseParentHandlers(false);
        Utils.LOGGER.addHandler(logHandler);
    }

    @Before
    public void setUp() {
        super.setUp();
        logHandler.clear();
    }

    @SuppressWarnings("unused")
    @AfterClass
    public static void tearDownClass() {
        Utils.LOGGER.removeHandler(logHandler);
        Utils.LOGGER.setUseParentHandlers(useParentHandlersValue);
    }

    @Test
    public void logInfo() throws Exception {
        testLogWithLevel(Level.INFO);
    }

    @Test
    public void logWarning() throws Exception {
        testLogWithLevel(Level.WARNING);
    }

    @Test
    public void logError() throws Exception {
        testLogWithLevel(Level.SEVERE);
    }

    @Test
    public void testWellDefined() throws Exception {
        TestUtils.testIfUtilsClassIsWellDefined(Utils.class);
    }

    private void testLogWithLevel(Level level) throws Exception {
        final String expectedMessage = testUtils.getRandomShortString();
        if (level == Level.INFO) {
            Utils.logInfo(expectedMessage);
        } else if (level == Level.SEVERE) {
            Utils.logError(expectedMessage);
        } else if (level == Level.WARNING) {
            Utils.logWarning(expectedMessage);
        }
        Assert.assertTrue(logHandler.isMessagePresent(level, expectedMessage));
    }

    @Test
    public void getDescriptorDisplayName() throws Exception {
        final String expected = getClass().getSimpleName();
        final String obtained = Utils.getDescriptorDisplayName(this);
        Assert.assertNotNull(obtained);
        Assert.assertTrue(obtained.contains(expected));
    }

    @Test
    public void fixEmptyString() throws Exception {
        final String emptyString = "";
        final String expectedNonEmptyString = testUtils.getRandomLongString();
        Assert.assertEquals(emptyString, Utils.fixEmptyString(null));
        Assert.assertEquals(emptyString, Utils.fixEmptyString(null));
        Assert.assertEquals(expectedNonEmptyString, Utils.fixEmptyString(expectedNonEmptyString));
    }

    @Test
    public void isAnyStringEmpty() throws Exception {
        final String nonEmptyString = "foo";
        final String nullString = null;
        final String emptyString = "";

        Assert.assertTrue(Utils.isAnyStringEmpty(nullString));
        Assert.assertTrue(Utils.isAnyStringEmpty(nullString, nullString));
        Assert.assertTrue(Utils.isAnyStringEmpty(emptyString));
        Assert.assertTrue(Utils.isAnyStringEmpty(emptyString, nonEmptyString));

        Assert.assertFalse(Utils.isAnyStringEmpty());
        Assert.assertFalse(Utils.isAnyStringEmpty(nonEmptyString));
        Assert.assertFalse(Utils.isAnyStringEmpty(nonEmptyString, nonEmptyString));
        //noinspection RedundantArrayCreation
        Assert.assertFalse(Utils.isAnyStringEmpty(new String[]{nonEmptyString}));
    }

    @Test
    public void firstNonEmptyString() throws Exception {
        final String expectedString = testUtils.getRandomMediumString();
        final String emptyString = "";
        Assert.assertEquals(expectedString, Utils.firstNonEmptyString(expectedString));
        Assert.assertEquals(expectedString, Utils.firstNonEmptyString(null, expectedString));
        Assert.assertEquals(expectedString, Utils.firstNonEmptyString(null, emptyString, expectedString));
        Assert.assertEquals(expectedString, Utils.firstNonEmptyString(expectedString, emptyString, null));

        expectedException.expect(IllegalArgumentException.class);
        Utils.firstNonEmptyString();
        Utils.firstNonEmptyString((String) null);
        Utils.firstNonEmptyString(emptyString);
        Utils.firstNonEmptyString((String[]) null);
    }

    @Test
    public void getFormattedTimestamp() throws Exception {
        for (int i = 0; i < TEST_REPEAT_COUNT; i++) {
            final ExpectedDate expectedDate = new ExpectedDate(testUtils.rnd);
            final String obtained = Utils.getFormattedTimestamp(expectedDate.toDate());
            Assert.assertNotNull(obtained);
            final String expected = String.format(Locale.US, EXPECTED_TIMESTAMP_FORMAT,
                    expectedDate.expectedYear,
                    expectedDate.expectedMonth + 1, // date formatter's month index starts at 1
                    expectedDate.expectedDayOfMonth,
                    expectedDate.expectedHour,
                    expectedDate.expectedMinute,
                    expectedDate.expectedSecond);
            Assert.assertEquals(expected, obtained);
        }
    }
}