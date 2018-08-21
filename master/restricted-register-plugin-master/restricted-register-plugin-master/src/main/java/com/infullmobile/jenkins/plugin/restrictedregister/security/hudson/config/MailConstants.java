package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.config;

import com.infullmobile.jenkins.plugin.restrictedregister.mail.data.LocalVariables;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.LocalVariablesBuilder;
import com.infullmobile.jenkins.plugin.restrictedregister.util.HtmlFormatter;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class MailConstants {

    private static final String SUBJECT_PREFIX = "[Jenkins] ";
    private static final String DEFAULT_CONTENT_HEADER =
            "<h4>Hello " + LocalVariables.wrap(LocalVariablesBuilder.VAR_USER_DISPLAY_NAME) + ",</h4>";

    public static final String DEFAULT_WELCOME_EMAIL_SUBJECT = SUBJECT_PREFIX + "Account activated";

    public static final String DEFAULT_CONFIRMATION_EMAIL_SUBJECT = SUBJECT_PREFIX + "New account";
    public static final String DEFAULT_CONFIRMATION_EMAIL_CONTENT = DEFAULT_CONTENT_HEADER +
            HtmlFormatter.paragraph("Your account has been added, but it must " +
                    "be activated first before you can sign in."
            ) +
            HtmlFormatter.paragraph("You can do that by clicking the link below and following instructions displayed " +
                    "on account activation page."
            ) +
            HtmlFormatter.paragraph(
                    HtmlFormatter.aHref(LocalVariables.wrap(LocalVariablesBuilder.VAR_CONFIRMATION_LINK))
            );

    public static final String DEFAULT_WELCOME_EMAIL_CONTENT = DEFAULT_CONTENT_HEADER +
            HtmlFormatter.paragraph("Your account with id " +
                    HtmlFormatter.italic(LocalVariables.wrap(LocalVariablesBuilder.VAR_USER_ID)) + " is now active."
            ) +
            HtmlFormatter.paragraph("You can sign in at " +
                    HtmlFormatter.aHref(LocalVariables.wrap(LocalVariablesBuilder.VAR_SIGN_IN_LINK))
            );

    public static final String ADMIN_NOTIFICATION_EMAIL_SUBJECT = SUBJECT_PREFIX + "New user account activated";
    public static final String ADMIN_NOTIFICATION_EMAIL_CONTENT =
            HtmlFormatter.paragraph("New user account has been created and activated:") +
                    HtmlFormatter.paragraph("ID: " +
                            LocalVariables.wrap(LocalVariablesBuilder.VAR_USER_ID)
                    ) +
                    HtmlFormatter.paragraph("email: " +
                            LocalVariables.wrap(LocalVariablesBuilder.VAR_USER_EMAIL)
                    ) +
                    HtmlFormatter.paragraph("display name: " +
                            LocalVariables.wrap(LocalVariablesBuilder.VAR_USER_DISPLAY_NAME)
                    );

    private MailConstants() {

    }
}
