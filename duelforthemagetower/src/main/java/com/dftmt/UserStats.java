package com.dftmt;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserStats
{
	private final String username;
	private int stat1;
	private int stat2;
	
	public UserStats(String username)
	{
		this.username = username;
		stat1 = 0;
		stat2 = 0;
	}
	
	public UserStats(@JsonProperty("username")String username, @JsonProperty("stat1")int stat1, @JsonProperty("stat2")int stat2)
	{
		this.username = username;
		this.stat1 = stat1;
		this.stat2 = stat2;
	}

	
	public void copyStats(UserStats stat)
	{
		stat1 = stat.getStat1();
		stat2 = stat.getStat2();
	}
	
	public String getUsername() { return username; }
	public int getStat1() { return stat1; }
	public int getStat2() { return stat2; }
	public void setStat1(int s) { stat1 = s; }
	public void setStat2(int s) { stat2 = s; }
	
	public void increaseStat1(int amount)
	{
		stat1 += amount;
	}
	public void increaseStat2(int amount)
	{
		stat2 += amount;
	}
}
