package com.dftmt;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebSocketMatchHandler extends TextWebSocketHandler
{
	private int count = 0;
	@Autowired
	private UserService userService; //ref al user service para comprobar los usuarios cuando se inicia la conexion
	
	//tiempo max de una sesion en partida sin responder antes de cerrarla (en milisegundos)
	private long maxTimeout = 1000 * 5; 
	private long maxTimeOnQueue = 1000 * 60; //tiempo max buscando partida (en milisegundos)
	
	//mapa de id de sesion a objeto de sesion
	private ConcurrentHashMap<String, WebSocketSession> sessionsMap;
	//mapa de id de sesion a usuario
	private ConcurrentHashMap<String, GameUser> userSessions; 
	//mapa de id sesion 1 a id sesion 2 de un emparejamiento de jugadores
	//hay 1 entrada por cada jugador, por ejemplo si j1 tiene id:"1234" y j2 tiene id:"7890"
	//hay 1 entrada con key "1234"y value "7890" y otra con key "7890" y value "1234"
	private ConcurrentHashMap<String, String> sessionMatches;
	//cola con los ids de las sesiones que esten buscando emparejamiento
	private ConcurrentLinkedQueue<String> sessionsOnQueue;
	
	private ObjectMapper objectMapper; //mapper para hacer y parsear los JSONs
	
	
	public WebSocketMatchHandler() //inicializar las estructuras
	{
		sessionsMap = new ConcurrentHashMap<>();
		userSessions = new ConcurrentHashMap<>();
		sessionMatches = new ConcurrentHashMap<>();
		sessionsOnQueue = new ConcurrentLinkedQueue<>();
		
		objectMapper = new ObjectMapper();
	}
	
	//metodo llamado cada que se recibe un mensaje de una sesion abierta
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception
	{
		//si el id de la sesion no esta en el mapa, hay que inicializar la sesion
		if(!sessionsMap.containsKey(session.getId()))
		{
			String answer = startNewSession(session, message.getPayload());
			//session.sendMessage(new TextMessage(answer)); //mensaje de error o confirmacion al cliente
			sendMessage(session, answer);
			System.out.println("Mensaje enviado: " + answer);
			return;
		}
		
		if(message.getPayload().startsWith("!")) //si es un mensaje para el server (empieza con !)
		{
			readServerMessage(session, message.getPayload());
			return;
		}
		
		//sino, es un mensaje para el otro jugador.
		ObjectNode json = objectMapper.createObjectNode();
		
		//si no esta en partida  no se puede comunicar con otro jugador
		if(!(Boolean) session.getAttributes().get("isOnMatch"))
		{
			json.put("error", "Mensaje enviado a un oponente sin estar en partida.");
			json.put("onQueue", true);
			//session.sendMessage (new TextMessage(JSONToString(json)));
			sendMessage(session, JSONToString(json));
			return;
		}
	
		String otherId = sessionMatches.get(session.getId());
		
		if(otherId == null) //si la otra sesion se desconectó
		{
//			json.put("error", "El oponente se desconectó, volviendo a la cola.");
//			json.put("onMatch", true);
//			//session.sendMessage (new TextMessage(JSONToString(json)));
//			sendMessage(session, JSONToString(json));
//			
//			session.getAttributes().put("startQueueTime", System.currentTimeMillis());
//			session.getAttributes().put("isOnMatch", false);
//			sessionsOnQueue.add(session.getId());
			return;
		}
		
		//se envia el mensaje al otro jugador/sesion/cliente con el que este emparejado
		
		try
		{
			JsonNode jsonNode = objectMapper.readTree(message.getPayload());
			json = jsonNode.deepCopy();
		}
		catch (Exception e)
		{
			System.out.println("Error leyendo json: " + e.getMessage());
			return;
		}
		
		WebSocketSession otherSession = sessionsMap.get(otherId);
		json.put("onMatch", true);
		json.put("fromPlayer", true);
		if(otherSession.isOpen())
		{
			//otherSession.sendMessage(new TextMessage(JSONToString(json)));
			sendMessage(otherSession, JSONToString(json));
			session.getAttributes().put("lastMessageTime", System.currentTimeMillis());
		}
		
		
	}
	
	//inicializa una sesion
	private String startNewSession(WebSocketSession session, String message)
	{
		
		ObjectNode json = objectMapper.createObjectNode();
		json.put("onStart", true);
		
		//como es un mensaje al server debe empezar con un ! antes del JSON
		if(!message.startsWith("!"))
		{
			json.put("error", "Formato inválido en el mensaje.");
			json.put("invalidFormat", true);
			return JSONToString(json);
		}
		
		//la primera vez se debe mandar el nombre de usuario en un JSON
		GameUser user = GameUser.fromJSON(message.substring(1));
		if(user == null)
		{
			json.put("error", "Usuario inválido en el mensaje.");
			json.put("invalidUser", true);
			return JSONToString(json); 
		}
		
		//se comprueba que el usuario este en el mapa de la api rest
		GameUser existingUser = userService.getUser(user.getUsername());
		if(existingUser == null || !existingUser.getLogged())
		{
			json.put("error", "Usuario inválido.");
			json.put("invalidUser", true);
			return JSONToString(json);
		}
		
		if(userSessions.contains(existingUser))
		{
			json.put("error", "Usuario en otra sesión.");
			json.put("userInSession", true);
			return JSONToString(json);
		}
		
		//añadimos la sesion y usuario a los mapas
		sessionsMap.put(session.getId(), session);
		userSessions.put(session.getId(), existingUser);
		
		//inicializamos los atributos de la sesion
		session.getAttributes().put("lastMessageTime", System.currentTimeMillis());
		session.getAttributes().put("startQueueTime", System.currentTimeMillis());
		session.getAttributes().put("isOnMatch", false);
		
		//añadimos la sesion a la cola de emparejamiento
		sessionsOnQueue.add(session.getId());
		
		json.put("info", "Sesión de emparejamiento iniciada para " + existingUser.getUsername() + ".");
		
		return JSONToString(json);
	}
	
	//funcion llamada en el main periodicamente
	public void updateSessions()
	{
		System.out.println("UPDATESESIONES");
		doMatchmaking();
		checkSessions();
	}
	
	//empareja a los usuarios de la cola
	private void doMatchmaking()
	{
		//si no hay al menos 2 usuarios no se puede emparejar
		if(sessionsOnQueue.size() < 2) return;
		
		//empareja a los 2 primeros usuarios de la cola
		//los saca de la cola pues ya estan emparejados
		String id1 = sessionsOnQueue.poll(), id2 = sessionsOnQueue.poll();
		
		sessionMatches.put(id1, id2);
		sessionMatches.put(id2, id1);
		
		WebSocketSession s1 = sessionsMap.get(id1), s2 = sessionsMap.get(id2);
		
		//actualiza los atributos de las sesiones
		s1.getAttributes().put("isOnMatch", true);
		s1.getAttributes().put("lastMessageTime", System.currentTimeMillis());
		s2.getAttributes().put("isOnMatch", true);
		s2.getAttributes().put("lastMessageTime", System.currentTimeMillis());
		
		//mensajes en JSON para cada usuario con la informacion del otro usuario y de quien es el jugador 1
		String[] jsons = getMatchStartJSONs(id1, id2);
		
		try
		{	//enviar mensajes a las sesiones
			//s1.sendMessage(new TextMessage(jsons[0]));
			sendMessage(s1, jsons[0]);
			//s2.sendMessage(new TextMessage(jsons[1]));
			sendMessage(s2, jsons[1]);
		}
		catch(Exception e)
		{
			System.out.println("Error al enviar mensajes de inicio de partida: " + e.getMessage());
		}
	}
	
	private void checkSessions() //metodo llamado para comprobar si las sesiones siguen activas
	{
		System.out.println(" /checkeo de sesiones/ " + count ++);
		ObjectNode json = objectMapper.createObjectNode();
		WebSocketSession session = null;
		Long lastMessageTime = null, startQueueTime = null;
		Map<String, Object> attribs = null;
		Long currentTime = System.currentTimeMillis();
		
		//se iteran todas las sesiones del mapa
		for	(String id : sessionsMap.keySet())
		{
			session = sessionsMap.get(id);
			
			if(session == null) continue;
			
			attribs = session.getAttributes();
			lastMessageTime = (Long) attribs.get("lastMessageTime"); 
			startQueueTime = (Long) attribs.get("startQueueTime");
			Boolean isOnMatch = (Boolean) attribs.get("isOnMatch");
			
			CloseStatus status = null;
			
			if(lastMessageTime == null || startQueueTime == null || isOnMatch == null) continue;
			
			//si esta en partida y lleva un tiempo sin enviar nada, se cierra
			if(isOnMatch && currentTime - lastMessageTime >= maxTimeout)
			{
//				json.put("error", "Sesion cerrada por inactividad durante partida.");
//				json.put("onMatch", true);
//				json.put("matchTimeout", true);
				//status = new CloseStatus(8888, "matchTimeout");
			}
			//si lleva demasiado tiempo en la cola sin encontrar partida se cierra
			else if(!isOnMatch && currentTime - startQueueTime >= maxTimeOnQueue)
			{
//				json.put("error", "Sesion cerrada por tiempo de espera demasiado largo en la cola.");
//				json.put("onQueue", true);
//				json.put("queueTimeout", true);
				//status = new CloseStatus(9999, "queueTimeOut");
			}
			else continue; //si no se cierra la conexion avanzamos a la siguiente iteracion
			System.out.println("Cerrando sesion de " + userSessions.get(id).getUsername());
			//si se cierra
			//mandamos el mensaje de cierre a la sesion
			//json.put("onClose", true);
			//sendMessage(session, JSONToString(json));
			//closeSession(session, status);
			closeSession(session);
		}
		
	}
	
	private void closeSession(WebSocketSession session)
	{
		closeSession(session, CloseStatus.NORMAL);
	}
	
	private void closeSession(WebSocketSession session, CloseStatus status)
	{
		try
		{
			String id = session.getId();
			String username = userSessions.get(id).getUsername();
			Boolean onMatch = (Boolean) session.getAttributes().get("isOnMatch");
			session.close(status); //cerramos la sesion
			//quitamos la sesion de los mapas
			sessionsMap.remove(id);
			userSessions.remove(id);
			
			System.out.println("Sesion cerrada para" + username);
			//si estaba en la cola la quitamos de la cola
			if(onMatch == null || !onMatch) sessionsOnQueue.remove(session.getId()); 
			else
			{	//si estaba en partida quitamos el emparejamiento con el otro jugador
				
				String otherId = sessionMatches.get(id);
				sessionMatches.remove(id);
				if(otherId != null)
				{
					sessionMatches.remove(otherId);
					if(sessionsMap.containsKey(otherId) || sessionsMap.get(otherId) != null) 
						closeSession(sessionsMap.get(otherId)/*, new CloseStatus(7777, "opponentDisconnected")*/);	
				}
				
						
			}

		}
		catch(Exception e)
		{
			System.out.println("Error cerrando sesión: " + e.getMessage());
		}
		
	}
	
	//metodo que devuelve JSONs con info de comienzo de partida para ambos jugadores
	private String[] getMatchStartJSONs(String id1, String id2)
	{
		//un json por cada jugador
		ObjectNode json1 = objectMapper.createObjectNode(), json2 = objectMapper.createObjectNode();
		
		GameUser u1 = userSessions.get(id1), u2 = userSessions.get(id2);
		
		json1.put("onQueue", true);
		json2.put("onQueue", true);
		
		json1.put("matchStart", true);
		json2.put("matchStart", true);
		
		json1.put("username", u1.getUsername());
		json2.put("username", u2.getUsername());

		json1.put("otherUsername", u2.getUsername());
		json2.put("otherUsername", u1.getUsername());
		
		//se decide aleatoriamente quien es el jugador 1 (el de la izquierda)
		boolean isP1 = new Random().nextBoolean();
		json1.put("isPlayer1", isP1);
		json2.put("isPlayer1", !isP1);
				

		String[] jsons = {JSONToString(json1), JSONToString(json2)};
		return jsons;
	}
	
	private String JSONToString(ObjectNode json)
	{
		try
		{
			return objectMapper.writeValueAsString(json);
		}
		catch (Exception e)
		{
			System.out.println("Error al pasar de JSON a String: " + e.getMessage());
			return null;
		}
	}
	
	private void readServerMessage(WebSocketSession session, String message)
	{

		JsonNode json = null;
		try
		{
			json = objectMapper.readTree(message.substring(1));
		}
		catch (Exception e)
		{
			System.out.println("Error leer JSON de mensaje al servidor: " + e.getMessage());
			return;
		}
		
		Boolean closeSession = json.get("closeSession").asBoolean();
		if(closeSession == true)
		{
			//cerrar sesion
			closeSession(session);
			return;
		}
		
		//aqui poner mas mensajes que sean para el servidor en vez de para el otro jugador
		//ponerlos como propiedades del json que se envie:
		//"!{"closeSession" : false, "prop1": 10, "prop2" : "hola"}" por ejemplo
		//y leerlos aqui como se lee closeSession
	}
	
	private void sendMessage(WebSocketSession session, String message) //para mandar mensajes thread safe
	{
		if(!session.isOpen())
		{
			System.out.println("Error al enviar mensaje a sesion cerrada.");
			return;
		}
	
        try
        {
        	ConcurrentWebSocketSessionDecorator concurrentSession = new ConcurrentWebSocketSessionDecorator(session, 500, 1000);
            concurrentSession.sendMessage(new TextMessage(message));
        }
        catch (Exception e)
        {
            System.out.println("Error mandando mensaje: " + e.getMessage());
        }
	}
}
