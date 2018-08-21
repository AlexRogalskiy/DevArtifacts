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
public final class ConfirmationEmail {

    private ConfirmationEmail() {

    }

    public static Mail create(LocalVariables localVariables, String recipients) throws MailException {
        final RegistrationConfigImpl config = (RegistrationConfigImpl) PluginModule.getDefault().getPluginDescriptor()
                .getConfigForSecurityRealmRegistration(HudsonSecurityRealmRegistration.class);
        final String subject = Utils.firstNonEmptyString(config.getConfirmationEmailSubject(),
                MailConstants.DEFAULT_CONFIRMATION_EMAIL_SUBJECT);
        final String message = Utils.firstNonEmptyString(config.getConfirmationEmailContent(),
                MailConstants.DEFAULT_CONFIRMATION_EMAIL_CONTENT);

        return Commons.createBaseBuilder(localVariables, recipients)
                .subject(subject)
                .message(message)
                .build();
    }
}
