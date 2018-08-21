package com.infullmobile.jenkins.plugin.restrictedregister.mail;

import com.infullmobile.jenkins.plugin.restrictedregister.mail.impl.NoopMessageFormatter;
import com.infullmobile.jenkins.plugin.restrictedregister.util.Utils;
import hudson.tasks.Mailer;
import jenkins.plugins.mailer.tasks.MimeMessageBuilder;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.validator.routines.EmailValidator;

import javax.mail.MessagingException;
import javax.mail.Transport;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Adam Kobus on 30.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public final class Mail {

    private static final String META_CHARSET = "UTF-8";
    private static final String META_CONTENT_TYPE = "text/html; charset=utf-8";

    private static final String EMAIL_SEPARATOR = ",";

    private final String recipients;
    private final String subject;
    private final String message;
    private final IMessageFormatter messageFormatter;
    private final String replyTo;

    private Mail(Builder builder) throws MailException {
        this.recipients = builder.getRecipients();
        this.message = builder.getMessage();
        this.subject = builder.getSubject();
        this.messageFormatter = builder.getMessageFormatter();
        this.replyTo = builder.getReplyToAddress();
    }

    public void send() throws MailException {
        MimeMessage msg = null;
        try {
            msg = createMessage();
        } catch (UnsupportedEncodingException e) {
            fail("Failed to encode e-mail message, " + e.getLocalizedMessage());
        } catch (MessagingException e) {
            fail("");
        }
        if (msg == null) {
            throw new NullPointerException("Message must not be null");
        }
        try {
            Transport.send(msg);
        } catch (MessagingException e) {
            fail("Failed to send e-mail message");
        }
    }

    private MimeMessage createMessage() throws MailException, UnsupportedEncodingException,
            MessagingException {
        final String content = getContent();
        final String replyToAddress = replyTo;

        final MimeMessageBuilder messageBuilder = new MimeMessageBuilder();
        messageBuilder.setSubject(this.subject);
        messageBuilder.setCharset(META_CHARSET);
        messageBuilder.addRecipients(this.recipients);
        if (EmailValidator.getInstance().isValid(replyToAddress)) {
            Utils.logInfo("Reply to address " + replyToAddress);
            messageBuilder.setReplyTo(replyToAddress);
        }
        final MimeMessage message = messageBuilder.buildMimeMessage();
        message.setContent(content, META_CONTENT_TYPE);
        return message;
    }

    private String getContent() {
        return messageFormatter.formatMessage(message);
    }

    private void fail(String message) throws MailException {
        Utils.logError(message);
        throw new MailException(message);
    }

    public static Builder startBuilding() {
        return new Builder();
    }

    public static final class Builder {

        private List<String> recipients = new LinkedList<>();
        private String subject;
        private String message;
        private String recipientsRaw;
        private IMessageFormatter messageFormatter;
        private String replyTo;

        private Builder() {

        }

        @SuppressWarnings("unused")
        public Builder addRecipient(String address) {
            this.recipients.add(address);
            return this;
        }

        public Builder addRecipients(String addresses) {
            this.recipientsRaw = addresses;
            return this;
        }

        public Builder subject(String subject) {
            this.subject = subject;
            return this;
        }

        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder replyToAddress(String value) {
            this.replyTo = value;
            return this;
        }

        public Builder messageFormatter(IMessageFormatter messageFormatter) {
            this.messageFormatter = messageFormatter;
            return this;
        }

        public Mail build() throws MailException {
            return new Mail(this);
        }

        private String getRecipients() {
            String ret = StringUtils.strip(Utils.fixEmptyString(recipientsRaw));
            if (StringUtils.isEmpty(ret)) {
                if (recipients.size() > 0) {
                    ret = StringUtils.join(recipients, EMAIL_SEPARATOR);
                }
            }
            return ret;
        }

        private IMessageFormatter getMessageFormatter() {
            if (messageFormatter == null) {
                return new NoopMessageFormatter();
            } else {
                return messageFormatter;
            }
        }

        private String getMessage() {
            return Utils.fixEmptyString(message);
        }

        private String getSubject() {
            return Utils.fixEmptyString(subject);
        }

        private String getReplyToAddress() {
            String ret = Utils.fixEmptyString(replyTo);
            if (StringUtils.isEmpty(ret)) {
                ret = Utils.fixEmptyString(Mailer.descriptor().getReplyToAddress());
            }
            return ret;
        }
    }
}
