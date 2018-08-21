package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.mail;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.Mail;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.MailException;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.data.LocalVariables;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.HudsonSecurityRealmRegistration;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.config.MailConstants;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.config.RegistrationConfigImpl;
import com.infullmobile.jenkins.plugin.restrictedregister.util.Utils;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class WelcomeEmail {

    private WelcomeEmail() {

    }

    public static Mail create(LocalVariables localVariables, String recipients) throws MailException {
        final RegistrationConfigImpl config = (RegistrationConfigImpl) PluginModule.getDefault().getPluginDescriptor()
                .getConfigForSecurityRealmRegistration(HudsonSecurityRealmRegistration.class);
        final String subject = Utils.firstNonEmptyString(config.getWelcomeEmailSubject(),
                MailConstants.DEFAULT_WELCOME_EMAIL_SUBJECT);
        final String message = Utils.firstNonEmptyString(config.getWelcomeEmailContent(),
                MailConstants.DEFAULT_WELCOME_EMAIL_CONTENT);

        return Commons.createBaseBuilder(localVariables, recipients)
                .subject(subject)
                .message(message)
                .build();
    }
}
