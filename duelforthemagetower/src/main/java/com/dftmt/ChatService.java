package com.dftmt;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.List;
import java.util.Random;
@Service
public class ChatService
{
	@Autowired
    private UserService userService;
	
	private HashMap<GameUser, GameChat> chats = new HashMap<>();
	
	public GameChat startChat(String username, String otherUsername)
	{
		GameUser existingUser = userService.getUser(username);
		GameUser otherUser = userService.getUser(otherUsername);
		
		if(existingUser == null || !existingUser.getLogged() || otherUser == null || !otherUser.getLogged()) return null;
		
		if(chats.containsKey(existingUser)) return chats.get(existingUser);
		
				
		final List<GameUser> loggedUsers = userService.getLoggedUsers();
		 
		if(loggedUsers.size() < 2) return null;
		 
	//	GameUser otherUser = null;
	//	while(otherUser == null)
	//	{
	//		int rnd = new Random().nextInt(loggedUsers.size());
	//		otherUser = loggedUsers.get(rnd);
	//		if(otherUser.equals(existingUser)) otherUser = null;
	//	}
		
		chats.put(existingUser, new GameChat(existingUser.getUsername(), otherUser.getUsername(), null));
		chats.put(otherUser, new GameChat(otherUser.getUsername(), existingUser.getUsername(), null));
		
		return chats.get(existingUser);
		
	}
	
	public GameChat getChat(String username)
	{
		GameUser existingUser = userService.getUser(username);
		if(existingUser == null || !existingUser.getLogged()) return null;
		if(!chats.containsKey(existingUser)) return null;
		
		String otherUsername = chats.get(existingUser).getOtherUsername();
		GameUser otherUser = userService.getUser(otherUsername);
		
		if(otherUser == null || !otherUser.getLogged()) return null;
		if(!chats.containsKey(otherUser)) return null;
		
		return chats.get(otherUser);

	}
	
	public GameChat setChat(GameChat chat)
	{
		if(chat == null) return null;
		GameUser existingUser = userService.getUser(chat.getUsername());
		
		if(existingUser == null || !existingUser.getLogged()) return null;
		if(!chats.containsKey(existingUser)) return null;
		
		GameChat existingChat = chats.get(existingUser);
		existingChat.setText(chat.getText());
		return existingChat;
	}
	
}
