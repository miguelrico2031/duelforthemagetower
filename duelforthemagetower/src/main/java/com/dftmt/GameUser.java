package com.dftmt;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GameUser
{
	private final String username;
	private String password = null;
	private boolean logged = false;
	
	public GameUser(@JsonProperty("username")String username, @JsonProperty("password")String password)
	{
		this.username = username;
		this.password = password;
		this.logged = true;
	}
	
	public String getPassword() { return password; }
	public String getUsername() { return username; }
	public boolean getLogged() { return logged; }
	
	public boolean setPassword(String p)
	{
		if(p.equals(password)) return false;
		password = p;
		return true;
	}
	
	public boolean setLogged(boolean l)
	{
		if(l == logged) return false;
		logged = l;
		return true;
	}
	
}
