package com.byteslounge.bean;

import java.io.Serializable;

import javax.enterprise.context.SessionScoped;
import javax.enterprise.inject.Produces;

import com.byteslounge.bean.impl.EmailMessageSender;
import com.byteslounge.bean.impl.SmsMessageSender;

@SessionScoped
public class MessageSenderFactory implements Serializable {

	private static final long serialVersionUID = 5269302440619391616L;

	@Produces
	@MessageTransport(MessageTransportType.EMAIL)
	public MessageSender getEmailMessageSender(EmailMessageSender emailMessageSender){
		return emailMessageSender;
	}
	
	@Produces
	@MessageTransport(MessageTransportType.SMS)
	public MessageSender getSmsMessageSender(){
		return new SmsMessageSender();
	}
	
}
