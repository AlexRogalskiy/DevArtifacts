package com.infullmobile.jenkins.plugin.restrictedregister;

import com.infullmobile.TestUtils;
import com.infullmobile.mock.MockPluginModule;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.ExpectedException;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class BaseTestClass {

    public static final int DEFAULT_TEST_TIMEOUT_MS = 5000;
    protected final TestUtils testUtils = new TestUtils();

    @Rule
    public final ExpectedException expectedException = ExpectedException.none();

    @SuppressWarnings("WeakerAccess")
    protected MockPluginModule mockPluginModule;

    @Before
    public void setUp() {
        mockPluginModule = new MockPluginModule();
        mockPluginModule.inject();
    }

    @After
    public void tearDown() {
        mockPluginModule.restoreDefault();
    }
}
