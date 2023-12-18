package com.dftmt;

import com.fasterxml.jackson.annotation.JsonProperty;


public class GameChat
{
	private final String username;
	private final String otherUsername;
	private String text;
	private int id;
	
	GameChat(String username, String otherUsername, String text)
	{
		this.username = username;
		this.otherUsername = otherUsername;
		this.text = text;
		this.id = -1;
	}
	
	GameChat(@JsonProperty("username")String username, @JsonProperty("otherUsername")String otherUsername, 
			@JsonProperty("text")String text, @JsonProperty("id")int id)
	{
		this.username = username;
		this.otherUsername = otherUsername;
		this.text = text;
		this.id = id;
	}
	
	
	
	public String getUsername() { return username; }
	public String getOtherUsername() { return otherUsername;}
	public String getText() { return text; }
	public int getId() { return id; }

	public void setText(String text)
	{
		this.text = new String(text);
		this.id ++;
	}

}
