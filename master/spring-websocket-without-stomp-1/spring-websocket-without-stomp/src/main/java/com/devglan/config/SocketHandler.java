package com.devglan.config;

import com.google.gson.Gson;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SocketHandler extends TextWebSocketHandler {
	
	List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message)
			throws InterruptedException, IOException {
		Map<String, String> value = new Gson().fromJson(message.getPayload(), Map.class);
		/*for(WebSocketSession webSocketSession : sessions) {
			webSocketSession.sendMessage(new TextMessage("Hello " + value.get("name") + " !"));
		}*/
			session.sendMessage(new TextMessage("Hello " + value.get("name") + " !"));
	}
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		//the messages will be broadcasted to all users.
		sessions.add(session);
	}

}