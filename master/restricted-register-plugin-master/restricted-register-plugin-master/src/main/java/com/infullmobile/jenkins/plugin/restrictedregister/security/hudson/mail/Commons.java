package com.infullmobile.jenkins.plugin.restrictedregister.security.hudson.mail;

import com.infullmobile.jenkins.plugin.restrictedregister.PluginModule;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.Mail;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.data.Footer;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.data.LocalVariables;
import com.infullmobile.jenkins.plugin.restrictedregister.mail.impl.RRMessageFormatter;
import com.infullmobile.jenkins.plugin.restrictedregister.settings.IPluginConfig;

/**
 * Created by Adam Kobus on 03.06.2016.
 * Copyright (c) 2016, inFullMobile
 * License: MIT, file: /LICENSE
 */
final class Commons {

    private Commons() {

    }

    static Mail.Builder createBaseBuilder(LocalVariables localVariables, String recipients) {
        final IPluginConfig pluginConfig = PluginModule.getDefault().getPluginDescriptor().getGlobalConfig();
        final String replyToAddress = pluginConfig.getReplyToEmail();
        final RRMessageFormatter messageFormatter = createFormatter();
        messageFormatter.getFormatterData().addInputData(localVariables);

        return Mail.startBuilding()
                .addRecipients(recipients)
                .replyToAddress(replyToAddress)
                .messageFormatter(messageFormatter);
    }

    private static RRMessageFormatter createFormatter() {
        final RRMessageFormatter ret = new RRMessageFormatter();
        ret.getFormatterData().addInputData(new Footer(PluginModule.getDefault()
                .getPluginDescriptor().getGlobalConfig().getEmailFooter()));
        return ret;
    }
}
