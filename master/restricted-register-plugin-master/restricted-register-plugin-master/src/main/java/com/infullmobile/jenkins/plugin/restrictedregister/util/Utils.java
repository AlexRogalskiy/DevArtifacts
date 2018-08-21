package com.infullmobile.jenkins.plugin.restrictedregister.util;

import com.infullmobile.jenkins.plugin.restrictedregister.RestrictedRegistrationPlugin;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.web.util.HtmlUtils;

import javax.annotation.Nonnull;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by Adam Kobus on 24.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class Utils {

    private static final String[][] STR_SUBSTITUTOR_SPECIAL_CHARACTERS = new String[][]{
            {
                    "$", "&#36;",
            },
            {
                    "{", "&#123;",
            },
            {
                    "}", "&#125;",
            },
    };

    private static final String DESCRIPTOR_NAME_FORMAT = "%s";
    static final Logger LOGGER = Logger.getLogger(RestrictedRegistrationPlugin.class.getSimpleName());

    private static final SimpleDateFormat FORMAT_TIMESTAMP = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private Utils() {

    }

    @SuppressWarnings("WeakerAccess")
    public static boolean isAnyStringEmpty(String... values) {
        for (String entry : values) {
            if (StringUtils.isEmpty(entry)) {
                return true;
            }
        }
        return false;
    }

    public static String firstNonEmptyString(String... values) {
        for (String value : values) {
            if (!StringUtils.isEmpty(value)) {
                return value;
            }
        }
        throw new IllegalArgumentException("Provided 0 arguments or all of them are empty");
    }

    public static void logInfo(String message) {
        LOGGER.log(Level.INFO, message);
    }

    @SuppressWarnings("WeakerAccess")
    public static void logWarning(String message) {
        LOGGER.log(Level.WARNING, message);
    }

    public static void logError(Throwable t) {
        final String ret = t.getMessage() + "\n" + ExceptionUtils.getFullStackTrace(t);
        logError(ret);
    }

    public static void logError(String message) {
        LOGGER.log(Level.SEVERE, message);
    }

    public static String getDescriptorDisplayName(Object object) {
        return String.format(Locale.US, DESCRIPTOR_NAME_FORMAT, object.getClass().getSimpleName());
    }

    public static String fixEmptyString(String input) {
        if (StringUtils.isEmpty(input)) {
            return "";
        }
        return input;
    }

    public static String escapeInputString(String value) {
        String ret = HtmlUtils.htmlEscape(value);
        for (String[] mapping : STR_SUBSTITUTOR_SPECIAL_CHARACTERS) {
            ret = ret.replace(mapping[0], mapping[1]);
        }
        return ret;
    }

    @Nonnull
    public static String getFormattedTimestamp(@Nonnull Date date) {
        synchronized (FORMAT_TIMESTAMP) {
            return FORMAT_TIMESTAMP.format(date);
        }
    }
}
