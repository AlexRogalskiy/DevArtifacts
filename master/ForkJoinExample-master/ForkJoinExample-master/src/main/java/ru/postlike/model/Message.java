package ru.postlike.model;

import java.util.Date;

/**
 * Immutable entity
 */
public class Message {
    private String body;
    private String addressee;
    private Date dateOfSend;

    public String getBody() {
        return body;
    }

    public String getAddressee() {
        return addressee;
    }

    public Date getDateOfSend() {
        return dateOfSend;
    }

    public static class MessageBuilder {
        private String body = null;
        private String addressee = null;
        private Date dateOfSend = null;

        public MessageBuilder setBody(String body) {
            this.body = body;
            return this;
        }

        public MessageBuilder setAddressee(String addressee) {
            this.addressee = addressee;
            return this;
        }

        public MessageBuilder setDateOfSend(Date dateOfSend) {
            this.dateOfSend = dateOfSend;
            return this;
        }

        public Message createMessage() {
            return new Message(this);
        }
    }

    private Message (MessageBuilder builder) {
        this.body = builder.body;
        this.addressee = builder.addressee;
        this.dateOfSend = builder.dateOfSend;
    }
}
