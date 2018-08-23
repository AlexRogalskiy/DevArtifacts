package com.byteslounge.servlet;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.byteslounge.bean.MessageSender;
import com.byteslounge.bean.MessageTransport;
import com.byteslounge.bean.MessageTransportType;

@WebServlet(name = "messageServlet", urlPatterns = {"/sendMessage"})
public class MessageSendingServlet extends HttpServlet {

	private static final long serialVersionUID = -3995970242890631574L;
	
	@Inject
	@MessageTransport(MessageTransportType.SMS)
	private MessageSender messageSender;
	
	protected void doGet(HttpServletRequest request,
		    HttpServletResponse response)
		    throws ServletException, IOException {
		
		messageSender.sendMessage();
		
	}
}
