package com.dftmt;
import java.util.HashMap;

public class GameUser
{
	private static HashMap<String, GameUser> users = null;
	
	private String username = null;
	private String password = null;
	private boolean logged = false;
	private UserStats stats = null;
	
	private GameUser(String username, String password)
	{
		this.username = username;
		this.password = password;
		this.logged = true;
		stats = new UserStats();
	}
	
	public static boolean signUp(String username, String password)
	{
		if(users == null) users = new HashMap<String, GameUser>();
		
		if(users.containsKey(username)) return false;
		
		GameUser newUser = new GameUser(username, password);
		
		users.put(username, newUser);
		return true;
	}
	
	public static GameUser getUser(String username)
	{
		if(users.containsKey(username)) return users.get(username);
		
		return null;
	}
	
	public boolean isLogged()
	{
		return logged;
	}
	
	public boolean logIn(String password)
	{
		logged = this.password.equals(password);
		return logged;
	}
	
	public boolean logOut()
	{
		if(!logged) return false;
		
		logged = false;
		return true;
	}
	
	public boolean changePassword(String newPassword)
	{
		if(newPassword == null || newPassword.equals(password)) return false;
		
		password = newPassword;
		return true;
	}
	
	public UserStats getStats() { return stats; }
	
	public boolean deleteUser()
	{
		if(!logged) return false;
		
		users.remove(username);
		return true;
	}
}
