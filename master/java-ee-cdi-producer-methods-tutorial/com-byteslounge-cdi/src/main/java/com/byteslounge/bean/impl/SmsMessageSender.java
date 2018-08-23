package com.byteslounge.bean.impl;

import com.byteslounge.bean.MessageSender;

public class SmsMessageSender implements MessageSender {

	@Override
	public void sendMessage() {
		System.out.println("Sending SMS message");
	}

}
