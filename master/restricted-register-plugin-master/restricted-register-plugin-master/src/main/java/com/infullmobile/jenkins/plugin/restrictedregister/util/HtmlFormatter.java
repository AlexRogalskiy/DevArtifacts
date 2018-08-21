package com.infullmobile.jenkins.plugin.restrictedregister.util;

import java.util.Locale;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class HtmlFormatter {

    private static final String HTML_HREF_FORMAT = "<a href=\"%s\">%s</a>";
    private static final String HTML_PARAGRAPH_FORMAT = "<p>%s</p>";
    private static final String HTML_ITALIC_FORMAT = "<i>%s</i>";

    private HtmlFormatter() {

    }

    public static String aHref(String link) {
        return aHref(link, link);
    }

    public static String aHref(String link, String displayValue) {
        return format(HTML_HREF_FORMAT, link, displayValue);
    }

    public static String paragraph(String content) {
        return format(HTML_PARAGRAPH_FORMAT, content);
    }

    public static String italic(String content) {
        return format(HTML_ITALIC_FORMAT, content);
    }

    private static String format(String format, Object ... vars) {
        return String.format(Locale.US, format, vars);
    }
}
