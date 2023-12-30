package com.dftmt;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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
	
	public GameUser()
	{
		this.username = null;
		this.password = null;
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
	
	public String toJSON()
	{
        ObjectMapper objectMapper = new ObjectMapper();
        try
        {
			String json = objectMapper.writeValueAsString(this);
			return json;
		}
        catch (Exception e)
        {
            System.out.println("Error al serializar: " + e.getMessage());
			return null;
		}
	}
	
	public static GameUser fromJSON(String json)
	{
		try
		{
            ObjectMapper objectMapper = new ObjectMapper();
            GameUser user = objectMapper.readValue(json, GameUser.class);
            return user;
            
        }
		catch (Exception e)
		{
            System.out.println("Error al deserializar: " + e.getMessage());
            return null;
        }
	}
	
}
