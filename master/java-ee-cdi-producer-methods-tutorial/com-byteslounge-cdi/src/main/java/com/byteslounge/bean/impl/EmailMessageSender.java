package com.byteslounge.bean.impl;

import com.byteslounge.bean.MessageSender;

public class EmailMessageSender implements MessageSender {

	@Override
	public void sendMessage() {
		System.out.println("Sending email message");
	}

}
