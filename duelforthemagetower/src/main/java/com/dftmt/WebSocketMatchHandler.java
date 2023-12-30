package com.dftmt;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebSocketMatchHandler extends TextWebSocketHandler
{
	private long maxTimeout = 1000 * 5; //tiempo max de una sesion sin responder para cerrarla (en milisegundos)
	private long maxTimeOnQueue = 1000 * 15; //tiempo max buscando partida (en milisegundos)
	
	@Autowired
    private UserService userService;
	
	private ConcurrentHashMap<String, WebSocketSession> sessionsMap;
	private ConcurrentHashMap<String, GameUser> userSessions;
	private ConcurrentHashMap<String, String> sessionMatches;
	private ConcurrentLinkedQueue<String> sessionsOnQueue;
	
	private ObjectMapper objectMapper;
	
	
	public WebSocketMatchHandler()
	{
		sessionsMap = new ConcurrentHashMap<>();
		userSessions = new ConcurrentHashMap<>();
		sessionMatches = new ConcurrentHashMap<>();
		sessionsOnQueue = new ConcurrentLinkedQueue<>();
		
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception
	{
		if(!sessionsMap.containsKey(session.getId()))
		{
			String answer = startNewSession(session, message.getPayload());
			session.sendMessage(new TextMessage(answer));
			System.out.println("Mensaje enviado: " + answer);
		}
		else
		{
			
		}
		
		session.getAttributes().put("lastMessageTime", System.currentTimeMillis());
	}
	
	private String startNewSession(WebSocketSession session, String message)
	{
		GameUser user = GameUser.fromJSON(message);
		if(user == null) return "{\"error\": \"Usuario inválido en el mensaje.\"}";
		
		GameUser existingUser = userService.getUser(user.getUsername());
		
		if(existingUser == null || !existingUser.getLogged()) return "{\"error\": \"Usuario inválido.\"}";
		
		if(userSessions.contains(existingUser)) return "{\"error\": \"Usuario en otra sesión.\"}";
		
		sessionsMap.put(session.getId(), session);
		userSessions.put(session.getId(), existingUser);
		
		session.getAttributes().put("startQueueTime", System.currentTimeMillis());
		session.getAttributes().put("isOnMatch", false);
		sessionsOnQueue.add(session.getId());
		
		return "{\"info\": \"Sesion de matchmaking iniciada para " + existingUser.getUsername() + ".\"}";
	}
	
	public void updateSessions()
	{
		doMatchmaking();
		checkSessions();
	}
	
	private void doMatchmaking()
	{
		if(sessionsOnQueue.size() < 2) return;
		
		String id1 = sessionsOnQueue.poll(), id2 = sessionsOnQueue.poll();
		
		sessionMatches.put(id1, id2);
		sessionMatches.put(id2, id1);
		
		WebSocketSession s1 = sessionsMap.get(id1), s2 = sessionsMap.get(id2);
		
		s1.getAttributes().put("isOnMatch", true);
		s2.getAttributes().put("isOnMatch", true);
		
		String[] jsons = getMatchStartJSONs(id1, id2);
		
		try
		{
			s1.sendMessage(new TextMessage(jsons[0]));
			s2.sendMessage(new TextMessage(jsons[1]));
		}
		catch(Exception e)
		{
			System.out.println("Error al enviar mensajes de inicio de partida: " + e.getMessage());
		}
	}
	
	private void checkSessions() //metodo llamado cada segundo para comprobar las sesiones
	{
		String closeMsg = "";
		WebSocketSession session = null;
		Long lastMessageTime = null, startQueueTime = null;
		Map<String, Object> attribs = null;
		Long currentTime = System.currentTimeMillis();
		for	(String id : sessionsMap.keySet())
		{
			session = sessionsMap.get(id);
			attribs = session.getAttributes();
			lastMessageTime = (Long) attribs.get("lastMessageTime"); 
			startQueueTime = (Long) attribs.get("startQueueTime");
			Boolean isOnMatch = (Boolean) attribs.get("isOnMatch");
			if(lastMessageTime == null || startQueueTime == null || isOnMatch == null) continue;
			
			if(isOnMatch && currentTime - lastMessageTime >= maxTimeout)
			{
				closeMsg = "{\"info\": \"Sesion cerrada por inactividad durante partida.\"}";
			}
			else if(!isOnMatch && currentTime - startQueueTime >= maxTimeOnQueue)
			{
				closeMsg = "{\"info\": \"Sesion cerrada por tiempo de espera demasiado largo en la cola.\"}";
			}
			else continue;
			
			try
			{
				session.sendMessage(new TextMessage(closeMsg));
				session.close();
				
				sessionsMap.remove(id);
				userSessions.remove(id);
				
				if(isOnMatch) sessionMatches.remove(id);
				else sessionsOnQueue.remove(id);
			}
			catch (IOException e)
			{
				System.out.println("Error al cerrar socket: " + e.getMessage());
			}
		}
	}
	
	private String[] getMatchStartJSONs(String id1, String id2)
	{
		if(objectMapper == null) objectMapper = new ObjectMapper();
		
		ObjectNode json1 = objectMapper.createObjectNode(), json2 = objectMapper.createObjectNode();
		
		GameUser u1 = userSessions.get(id1), u2 = userSessions.get(id2);
		
		json1.put("username", u1.getUsername());
		json2.put("username", u2.getUsername());

		json1.put("otherUsername", u2.getUsername());
		json2.put("otherUsername", u1.getUsername());
		
		boolean isP1 = new Random().nextBoolean();
		json1.put("isPlayer1", isP1);
		json2.put("isPlayer1", !isP1);
				
		try
		{
			String[] jsons = { objectMapper.writeValueAsString(json1), objectMapper.writeValueAsString(json2) };
			return jsons;
		}
		catch (Exception e)
		{
			System.out.println("Error al crear JSONS de inicio de partida: " + e.getMessage());
			return null;
		}
	}
}
