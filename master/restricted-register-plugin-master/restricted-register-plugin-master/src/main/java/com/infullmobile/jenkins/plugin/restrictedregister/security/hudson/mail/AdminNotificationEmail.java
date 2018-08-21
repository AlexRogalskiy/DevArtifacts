package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.mail;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.Mail;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.MailException;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.data.LocalVariables;
import com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.config.MailConstants;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.IPluginConfig;
import org.apache.commons.lang.StringUtils;

/**
 * Created by Adam Kobus on 03.06.2016.
 * Copyright (c) 2016, inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class AdminNotificationEmail {

    private AdminNotificationEmail() {

    }

    public static Mail create(LocalVariables localVariables) throws MailException {
        final String subject = MailConstants.ADMIN_NOTIFICATION_EMAIL_SUBJECT;
        final String message = MailConstants.ADMIN_NOTIFICATION_EMAIL_CONTENT;
        final String recipients = getRecipients();

        return Commons.createBaseBuilder(localVariables, recipients)
                .subject(subject)
                .message(message)
                .build();
    }

    private static String getRecipients() {
        final IPluginConfig pluginConfig = PluginModule.getDefault().getPluginDescriptor().getGlobalConfig();
        String adminEmail = pluginConfig.getAdminEmail();
        if (StringUtils.isEmpty(adminEmail)) {
            adminEmail = PluginModule.getDefault().getJenkinsDescriptor().getAdminEmail();
        }
        return adminEmail;
    }
}
