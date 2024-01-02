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
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebSocketMatchHandler extends TextWebSocketHandler {
	@Autowired
	private UserService userService; // ref al user service para comprobar los usuarios cuando se inicia la conexion

	// tiempo max de una sesion en partida sin responder antes de cerrarla (en
	// milisegundos)
	private long maxTimeout = 1000 * 5;
	private long maxTimeOnQueue = 1000 * 30; // tiempo max buscando partida (en milisegundos)

	// mapa de id de sesion a objeto de sesion
	private ConcurrentHashMap<String, WebSocketSession> sessionsMap;
	// mapa de id de sesion a usuario
	private ConcurrentHashMap<String, GameUser> userSessions;
	// mapa de id sesion 1 a id sesion 2 de un emparejamiento de jugadores
	// hay 1 entrada por cada jugador, por ejemplo si j1 tiene id:"1234" y j2 tiene
	// id:"7890"
	// hay 1 entrada con key "1234"y value "7890" y otra con key "7890" y value
	// "1234"
	private ConcurrentHashMap<String, String> sessionMatches;
	// cola con los ids de las sesiones que esten buscando emparejamiento
	private ConcurrentLinkedQueue<String> sessionsOnQueue;

	private ObjectMapper objectMapper; // mapper para hacer y parsear los JSONs

	public WebSocketMatchHandler() // inicializar las estructuras
	{
		sessionsMap = new ConcurrentHashMap<>();
		userSessions = new ConcurrentHashMap<>();
		sessionMatches = new ConcurrentHashMap<>();
		sessionsOnQueue = new ConcurrentLinkedQueue<>();
	}

	// metodo llamado cada que se recibe un mensaje de una sesion abierta
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		// si el id de la sesion no esta en el mapa, hay que inicializar la sesion
		if (!sessionsMap.containsKey(session.getId())) {
			String answer = startNewSession(session, message.getPayload());
			session.sendMessage(new TextMessage(answer)); // mensaje de error o confirmacion al cliente
			System.out.println("Mensaje enviado: " + answer);
			return;
		}

		if (message.getPayload().startsWith("!")) // si es un mensaje para el server (empieza con !)
		{
			readServerMessage(session, message.getPayload());
			return;
		}

		// sino, es un mensaje para el otro jugador.

		// si no esta en partida no se puede comunicar con otro jugador
		if (!(Boolean) session.getAttributes().get("isOnMatch")) {
			session.sendMessage(
					new TextMessage("{\"error\": \"Mensaje enviado a un oponente sin estar en partida.\"}"));
			return;
		}

		// si el juego esta pausado, se notifica al jugador de ello
		if ((Boolean) session.getAttributes().get("isPaused")) {
			session.sendMessage(new TextMessage("{\"info\": \"Juego pausado. No se pueden enviar mensajes.\"}"));
			return;
		}

		String otherId = sessionMatches.get(session.getId());

		if (otherId == null) // si la otra sesion se desconectó
		{
			session.sendMessage(new TextMessage("{\"error\": \"El oponente se desconectó, volviendo a la cola.\"}"));

			session.getAttributes().put("startQueueTime", System.currentTimeMillis());
			session.getAttributes().put("isOnMatch", false);
			sessionsOnQueue.add(session.getId());
			return;
		}

		// se envia el mensaje al otro jugador/sesion/cliente con el que este emparejado

		WebSocketSession otherSession = sessionsMap.get(otherId);
		otherSession.sendMessage(new TextMessage(message.getPayload()));

		session.getAttributes().put("lastMessageTime", System.currentTimeMillis());
	}

	// inicializa una sesion
	private String startNewSession(WebSocketSession session, String message) {
		// como es un mensaje al server debe empezar con un ! antes del JSON
		if (!message.startsWith("!"))
			return "{\"error\": \"Formato inválido en el mensaje.\"}";

		// la primera vez se debe mandar el nombre de usuario en un JSON
		GameUser user = GameUser.fromJSON(message.substring(1));
		if (user == null)
			return "{\"error\": \"Usuario inválido en el mensaje.\"}";

		// se comprueba que el usuario este en el mapa de la api rest
		GameUser existingUser = userService.getUser(user.getUsername());
		if (existingUser == null || !existingUser.getLogged())
			return "{\"error\": \"Usuario inválido.\"}";

		if (userSessions.contains(existingUser))
			return "{\"error\": \"Usuario en otra sesión.\"}";

		// añadimos la sesion y usuario a los mapas
		sessionsMap.put(session.getId(), session);
		userSessions.put(session.getId(), existingUser);

		// inicializamos los atributos de la sesion
		session.getAttributes().put("lastMessageTime", System.currentTimeMillis());
		session.getAttributes().put("startQueueTime", System.currentTimeMillis());
		session.getAttributes().put("isOnMatch", false);
		session.getAttributes().put("isPaused", false);

		// añadimos la sesion a la cola de emparejamiento
		sessionsOnQueue.add(session.getId());

		return "{\"info\": \"Sesion de emparejamiento iniciada para " + existingUser.getUsername() + ".\"}";
	}

	// funcion llamada en el main periodicamente
	public void updateSessions() {
		doMatchmaking();
		checkSessions();
	}

	// empareja a los usuarios de la cola
	private void doMatchmaking() {
		// si no hay al menos 2 usuarios no se puede emparejar
		if (sessionsOnQueue.size() < 2)
			return;

		// empareja a los 2 primeros usuarios de la cola
		// los saca de la cola pues ya estan emparejados
		String id1 = sessionsOnQueue.poll(), id2 = sessionsOnQueue.poll();

		sessionMatches.put(id1, id2);
		sessionMatches.put(id2, id1);

		WebSocketSession s1 = sessionsMap.get(id1), s2 = sessionsMap.get(id2);

		// actualiza los atributos de las sesiones
		s1.getAttributes().put("isOnMatch", true);
		s2.getAttributes().put("isOnMatch", true);

		// mensajes en JSON para cada usuario con la informacion del otro usuario y de
		// quien es el jugador 1
		String[] jsons = getMatchStartJSONs(id1, id2);

		try { // enviar mensajes a las sesiones
			s1.sendMessage(new TextMessage(jsons[0]));
			s2.sendMessage(new TextMessage(jsons[1]));
		} catch (Exception e) {
			System.out.println("Error al enviar mensajes de inicio de partida: " + e.getMessage());
		}
	}

	private void checkSessions() // metodo llamado para comprobar si las sesiones siguen activas
	{
		String closeMsg = "";
		WebSocketSession session = null;
		Long lastMessageTime = null, startQueueTime = null;
		Map<String, Object> attribs = null;
		Long currentTime = System.currentTimeMillis();

		// se iteran todas las sesiones del mapa
		for (String id : sessionsMap.keySet()) {
			session = sessionsMap.get(id);
			attribs = session.getAttributes();
			lastMessageTime = (Long) attribs.get("lastMessageTime");
			startQueueTime = (Long) attribs.get("startQueueTime");
			Boolean isOnMatch = (Boolean) attribs.get("isOnMatch");

			if (lastMessageTime == null || startQueueTime == null || isOnMatch == null)
				continue;

			// si esta en partida y lleva un tiempo sin enviar nada, se cierra
			if (isOnMatch && currentTime - lastMessageTime >= maxTimeout) {
				closeMsg = "{\"info\": \"Sesion cerrada por inactividad durante partida.\"}";
			}
			// si lleva demasiado tiempo en la cola sin encontrar partida se cierra
			else if (!isOnMatch && currentTime - startQueueTime >= maxTimeOnQueue) {
				closeMsg = "{\"info\": \"Sesion cerrada por tiempo de espera demasiado largo en la cola.\"}";
			} else
				continue; // si no se cierra la conexion avanzamos a la siguiente iteracion

			// si se cierra
			try { // mandamos el mensaje de cierre a la sesion
				session.sendMessage(new TextMessage(closeMsg));
				session.close(); // cerramos la sesion

				// quitamos la sesion de los mapas
				sessionsMap.remove(id);
				userSessions.remove(id);

				// si estaba en la cola la quitamos de la cola
				if (!isOnMatch)
					sessionsOnQueue.remove(id);
				else { // si estaba en partida quitamos el emparejamiento con el otro jugador
					String otherId = sessionMatches.get(id);
					sessionMatches.remove(id);
					sessionMatches.remove(otherId);
				}
			} catch (IOException e) {
				System.out.println("Error al cerrar la sesion inactiva: " + e.getMessage());
			}
		}
	}

	// metodo que devuelve JSONs con info de comienzo de partida para ambos
	// jugadores
	private String[] getMatchStartJSONs(String id1, String id2) {
		if (objectMapper == null)
			objectMapper = new ObjectMapper();
		// un json por cada jugador
		ObjectNode json1 = objectMapper.createObjectNode(), json2 = objectMapper.createObjectNode();

		GameUser u1 = userSessions.get(id1), u2 = userSessions.get(id2);

		json1.put("username", u1.getUsername());
		json2.put("username", u2.getUsername());

		json1.put("otherUsername", u2.getUsername());
		json2.put("otherUsername", u1.getUsername());

		// se decide aleatoriamente quien es el jugador 1 (el de la izquierda)
		boolean isP1 = new Random().nextBoolean();
		json1.put("isPlayer1", isP1);
		json2.put("isPlayer1", !isP1);

		try {
			String[] jsons = { objectMapper.writeValueAsString(json1), objectMapper.writeValueAsString(json2) };
			return jsons;
		} catch (Exception e) {
			System.out.println("Error al crear JSONS de inicio de partida: " + e.getMessage());
			return null;
		}
	}

	private void readServerMessage(WebSocketSession session, String message) {
		if (objectMapper == null)
			objectMapper = new ObjectMapper();

		JsonNode json = null;
		try {
			json = objectMapper.readTree(message.substring(1));
		} catch (Exception e) {
			System.out.println("Error leer JSON de mensaje al servidor: " + e.getMessage());
			return;
		}

		Boolean closeSession = json.get("closeSession").asBoolean();
		if (closeSession == true) {
		    closeSession(session);
			return;
		}

		Boolean pauseGame = json.get("pauseGame").asBoolean();
		if (pauseGame == true) {
			pauseGame(session);
			return;
		}

		Boolean resumeGame = json.get("resumeGame").asBoolean();
		if (resumeGame == true) {
			resumeGame(session);
			return;
		}
		
		Boolean exitGame = json.get("exitGame").asBoolean();
		if (exitGame == true) {
			handleExitGame(session);
			return;
		}

		// aqui poner mas mensajes que sean para el servidor en vez de para el otro jugador
		// ponerlos como propiedades del json que se envie:
		// "!{"closeSession" : false, "prop1": 10, "prop2" : "hola"}" por ejemplo
		// y leerlos aqui como se lee closeSession
	}
	
	private void handleExitGame(WebSocketSession session) {

	    // Obtener el id y la sesión del otro jugador
	    String otherId = sessionMatches.get(session.getId());
	    WebSocketSession otherSession = sessionsMap.get(otherId);

	    // Notificar al otro jugador sobre la salida voluntaria
	    if (otherSession != null) {
	        try {
	            otherSession.sendMessage(new TextMessage("{\"exitGame\": true}"));
	        } catch (IOException e) {
	            System.out.println("Error al notificar salida voluntaria al otro jugador: " + e.getMessage());
	        }
	    }

	    // Cerrar la sesion actual
	    closeSession(session);
	}
	
	// metodo para cerrar una sesion 
	private void closeSession(WebSocketSession session) {
	    String sessionId = session.getId();

	    try {
	        // mandar mensaje de cierre a la sesion
	        session.sendMessage(new TextMessage("{\"info\": \"Sesión cerrada.\"}"));
	        session.close();

	        // eliminar la sesion de los mapas
	        sessionsMap.remove(sessionId);
	        userSessions.remove(sessionId);

	        // si estaba en la cola, quitarla de la cola
	        if (!(Boolean) session.getAttributes().get("isOnMatch"))
	            sessionsOnQueue.remove(sessionId);
	        else {
	            // si estaba en partida, quitar el emparejamiento con el otro jugador
	            String otherId = sessionMatches.get(sessionId);
	            sessionMatches.remove(sessionId);
	            sessionMatches.remove(otherId);
	        }
	    } catch (IOException e) {
	        System.out.println("Error al cerrar la sesión: " + e.getMessage());
	    }
	}

	// metodo que establece el juego como pausado en el servidor y avisa al otro jugador
	private void pauseGame(WebSocketSession session) {

		// establece juego pausado en el server
		session.getAttributes().put("isPaused", true);

		// obtiene el id y la sesion del otro jugador
		String otherId = sessionMatches.get(session.getId());
		WebSocketSession otherSession = sessionsMap.get(otherId);

		if (otherSession != null) {
			try {

				// le envia un mensaje de que el juego se ha pausado
				otherSession.sendMessage(new TextMessage("{\"pauseGame\": true}"));
			} catch (IOException e) {
				System.out.println("Error al pausar la partida: " + e.getMessage());
				return;
			}
		}
	}

	// metodo que establece el juego como reanudado en el servidor y avisa al otro jugador
	private void resumeGame(WebSocketSession session) {

		// establece juego despausado en el server
		session.getAttributes().put("isPaused", false);

		// obtiene el id y la sesion del otro jugador
		String otherId = sessionMatches.get(session.getId());
		WebSocketSession otherSession = sessionsMap.get(otherId);

		if (otherSession != null) {
			try {

				// le envia un mensaje de que el juego se ha despausado
				otherSession.sendMessage(new TextMessage("{\"resumeGame\": true}"));
			} catch (IOException e) {
				System.out.println("Error al reanudar la partida: " + e.getMessage());
				return;
			}
		}
	}
}
