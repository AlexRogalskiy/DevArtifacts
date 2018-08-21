package com.infullmobile.jenkins.plugin.restrictedregister.mail;

import hudson.ExtensionPoint;
import org.apache.commons.collections.comparators.NullComparator;

import java.util.Comparator;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public interface IMailMessageDecorator extends ExtensionPoint {

    String getTransformedMessage(FormatterData formatterData, String input);

    int getPriority();

    int PRIORITY_DEFAULT = 0;

    Comparator<IMailMessageDecorator> BY_PRIORITY_COMPARATOR_ASC = new Comparator<IMailMessageDecorator>() {

        private final NullComparator nullComparator = new NullComparator(false);

        @Override
        public int compare(IMailMessageDecorator left, IMailMessageDecorator right) {
            if (isAnyNull(left, right)) {
                return nullComparator.compare(left, right);
            }
            return Integer.compare(left.getPriority(), right.getPriority());
        }

        private boolean isAnyNull(IMailMessageDecorator left, IMailMessageDecorator right) {
            return left == null || right == null;
        }
    };
}
