package com.infullmobile.jenkins.plugin.restrictedregister.mail;

import com.infullmobile.jenkins.plugin.restrictedregister.BaseTestClass;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class IMailMessageDecoratorTest extends BaseTestClass {

    private static final int DECORATORS_COUNT = 50;

    @Rule
    public static final Timeout TIMEOUT = new Timeout(DEFAULT_TEST_TIMEOUT_MS);

    @Test
    public void sorting() throws Exception {
        final List<IMailMessageDecorator> decorators = new ArrayList<>(DECORATORS_COUNT);
        final int maxValue = DECORATORS_COUNT / 2;
        for (int i = 0; i < DECORATORS_COUNT; i++) {
            final int priority = maxValue - i;
            decorators.add(new MockMailMessageDecorator(priority));
            decorators.add(new MockMailMessageDecorator(priority));
        }
        // sanity check
        for (int i = 0; i < decorators.size() - 1; i++) {
            Assert.assertTrue(decorators.get(i).getPriority() >= decorators.get(i + 1).getPriority());
        }

        Collections.sort(decorators, IMailMessageDecorator.BY_PRIORITY_COMPARATOR_ASC);
        for (int i = 0; i < decorators.size() - 1; i++) {
            Assert.assertTrue(decorators.get(i).getPriority() <= decorators.get(i + 1).getPriority());
        }
    }

    @Test
    public void sortingWithNulls() throws Exception {
        final List<IMailMessageDecorator> decorators = new ArrayList<>(2);
        decorators.add(new MockMailMessageDecorator(Integer.MIN_VALUE));
        decorators.add(null);

        //sanity check
        Assert.assertNotNull(decorators.get(0));
        Assert.assertNull(decorators.get(1));

        Collections.sort(decorators, IMailMessageDecorator.BY_PRIORITY_COMPARATOR_ASC);
        Assert.assertNull(decorators.get(0));
        Assert.assertNotNull(decorators.get(1));
    }

    private static final class MockMailMessageDecorator implements IMailMessageDecorator {

        private final int priority;

        private MockMailMessageDecorator(int priority) {
            this.priority = priority;
        }

        @Override
        public String getTransformedMessage(FormatterData formatterData, String input) {
            return input;
        }

        @Override
        public int getPriority() {
            return priority;
        }
    }
}