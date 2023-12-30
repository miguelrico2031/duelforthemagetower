package com.dftmt;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class WebSocketMatchHandler extends TextWebSocketHandler
{
	private long maxTimeout = 1000 * 5; //tiempo max sin responder en milisegundos
	
	@Autowired
    private UserService userService;
	
	private ConcurrentHashMap<String, WebSocketSession> sessionsMap;
	private ConcurrentHashMap<String, GameUser> userSessions;
	
	
	public WebSocketMatchHandler()
	{
		sessionsMap = new ConcurrentHashMap<>();
		userSessions = new ConcurrentHashMap<>();
		
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception
	{
		if(!sessionsMap.containsKey(session.getId()))
		{
			String answer = startNewSession(session, message.getPayload());
			session.sendMessage(new TextMessage(answer));
		}
		else
		{
			
		}
		
		session.getAttributes().put("lastMessageTime", System.currentTimeMillis());
	}
	
	private String startNewSession(WebSocketSession session, String message)
	{
		GameUser user = GameUser.fromJSON(message);
		if(user == null) return "Usuario inválido en el mensaje.";
		
		GameUser existingUser = userService.getUser(user.getUsername());
		
		if(existingUser == null || !existingUser.getLogged()) return "Usuario inválido.";
		
		if(userSessions.contains(existingUser)) return "Usuario en otra sesión.";
		
		sessionsMap.put(session.getId(), session);
		userSessions.put(session.getId(), existingUser);
		return "Sesion de matchmaking iniciada para " + existingUser.getUsername();
	}
	
	
	public void checkSessions() //metodo llamado en main cada segundo para comprobar las sesiones
	{
		Long lastMessageTime = null;
		for	(String id : sessionsMap.keySet())
		{
			lastMessageTime = (Long) sessionsMap.get(id).getAttributes().get("lastMessageTime"); 
			if(lastMessageTime == null) continue;
			if(System.currentTimeMillis() - lastMessageTime <= maxTimeout) continue;
			
			try { sessionsMap.get(id).close(); }
			catch (IOException e) { e.printStackTrace(); }
			
		}
	}
}
