package com.dftmt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;  
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
@Service
public class UserService
{
	private HashMap<String, GameUser> users = null;
	private List<GameUser> loggedUsers = new ArrayList<>();
	
	private final String filePath = System.getProperty("user.dir") + "/src/main/resources/data/users.txt";

	public GameUser signUp(GameUser user)
	{	
		if(users == null) loadUsers();
		if(user == null) return null;
		
		if(users.containsKey(user.getUsername())) return null;
		
		user.setLogged(true);
		users.put(user.getUsername(), user);
		printUsers();
		saveUsers();
		return user;
	}
	
	public GameUser getUser(String username)
	{
		if(users == null) loadUsers();
		if(users.containsKey(username)) return users.get(username);	
		return null;
	}
	
	
	public GameUser logIn(GameUser user)
	{
		if(users == null) loadUsers();
		if(user == null) return null;
		
		GameUser existentUser = getUser(user.getUsername());
		
		if(existentUser == null || !existentUser.getPassword().equals(user.getPassword()))
			return null;
		
		existentUser.setLogged(true);
		printUsers();
		loggedUsers.add(existentUser);
		return existentUser;
	}
	
	public GameUser logOut(GameUser user)
	{
		if(users == null) loadUsers();
		if(user == null) return null;
		
		GameUser existentUser = getUser(user.getUsername());
		
		if(existentUser == null) return null;
		
		existentUser.setLogged(false);
		printUsers();
		loggedUsers.remove(existentUser);
		return existentUser;
	}
	
	public GameUser changePassword(GameUser user)
	{
		if(users == null) loadUsers();
		if(user == null) return null;

		GameUser existentUser = getUser(user.getUsername());
		
		if(existentUser == null || !existentUser.getLogged()) return null;
		
		existentUser.setPassword(user.getPassword());
		printUsers();
		saveUsers();
		return existentUser;
	}
	
	public GameUser deleteUser(GameUser user)
	{
		if(users == null) loadUsers();
		if(user == null) return null;

		GameUser existentUser = getUser(user.getUsername());
		
		if(existentUser == null || !existentUser.getLogged()) return null;
		
		users.remove(existentUser.getUsername());
		printUsers();
		loggedUsers.remove(existentUser);
		saveUsers();
		return existentUser;

	}
	
	public final List<GameUser> getLoggedUsers() { return loggedUsers; }
	
	private void printUsers()
	{
		if(users == null) loadUsers();
		
		System.out.println("\nUSERS:");
		for (String key: users.keySet()) {
		    GameUser value = users.get(key);
		    System.out.println(key + " -> " + 
		    value.getPassword() + " -> logged: " + value.getLogged());
		}
	}
	
	
	private void saveUsers()
	{
	    ObjectMapper objectMapper = new ObjectMapper();

	    try
	    {
	        // Guardar el JSON en un archivo
	        File file = new File(filePath);
	        objectMapper.writeValue(file, users);
	        System.out.println("usuarios guardados en " + filePath);
	    }
	    catch (IOException e)
	    {
	    	System.out.println("Error al guardar fichero de usuarios: " + e.getMessage());
	    }
    }
	
	private void loadUsers()
	{
        ObjectMapper objectMapper = new ObjectMapper();

        // Cargar el JSON desde el archivo
        File file = new File(filePath);
        
        try
        {
            if (!file.exists()) users = new HashMap<>();
            users = objectMapper.readValue( file, new TypeReference<HashMap<String, GameUser>>() { }); 
            System.out.println("Usuarios cargados desde " + filePath);
            for(GameUser user : users.values()) user.setLogged(false);
            printUsers();
        }
        catch (IOException e)
        {
        	System.out.println("Error al leer fichero de usuarios: " + e.getMessage());
            users =  new HashMap<>();
        }
    }

}
