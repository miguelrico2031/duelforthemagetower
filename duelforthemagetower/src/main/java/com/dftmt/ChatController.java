package com.dftmt;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ObjectNode;

@RestController
@RequestMapping("/chat")
public class ChatController
{
	@Autowired
	private ChatService chatService;
	
	@PostMapping("/start")
	public ResponseEntity<GameChat> startChat(@RequestBody ObjectNode users)
	{
		System.out.println(users.toPrettyString());
		
		String user = users.get("username").asText();
		String otherUser = users.get("otherUsername").asText();
		
		System.out.println("Chat started: " + user + " with " + otherUser);
		if(user == null || otherUser == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		GameChat chat = chatService.startChat(user, otherUser);
		
		if(chat == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<>(chat, HttpStatus.OK);
	}
	
	@GetMapping("/{username}")
	public ResponseEntity<GameChat> getChat(@PathVariable String username)
	{
		GameChat chat = chatService.getChat(username);
		
		if(chat == null) return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		return new ResponseEntity<>(chat, HttpStatus.OK);
	}
	
	@PutMapping("/send")
	public ResponseEntity<GameChat> sendChat(@RequestBody GameChat chat)
	{
		if(chat == null || chat.getUsername() == null || chat.getOtherUsername() == null ||
				chat.getText() == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		chat = chatService.setChat(chat);
		
		if(chat == null)  return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

		return new ResponseEntity<>(chat, HttpStatus.OK);

	}

}
