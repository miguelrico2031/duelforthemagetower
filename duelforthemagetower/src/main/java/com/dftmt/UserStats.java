package com.dftmt;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserStats
{
	private final String username;
	private int hitsTaken;
	private int hitsGiven;
	private int hitsDeflected;
	private int wins;
	private int losses;
	
	public UserStats(String username)
	{
		this.username = username;
		this.hitsTaken = 0;
		this.hitsGiven = 0;
		this.hitsDeflected = 0;
		this.wins = 0;
		this.losses = 0;
	}
	
	public UserStats(@JsonProperty("username")String username, @JsonProperty("hitsGiven")int hitsGiven, @JsonProperty("hitsTaken")int hitsTaken, @JsonProperty("hitsDeflected")int hitsDeflected, @JsonProperty("wins")int wins, @JsonProperty("losses")int losses)
	{
		this.username = username;
		this.hitsGiven = hitsGiven;
		this.hitsTaken = hitsTaken;
		this.hitsDeflected = hitsDeflected;
		this.wins = wins;
		this.losses = losses;
	}

	
	public void copyStats(UserStats stat)
	{
		hitsGiven = stat.getHitsGiven();
		hitsTaken = stat.getHitsTaken();
		hitsDeflected = stat.getHitsDeflected();
		wins = stat.getWins();
		losses = stat.getLosses();
	}
	
	public String getUsername() { return username; }
	public int getHitsGiven() { return hitsGiven; }
	public int getHitsTaken() { return hitsTaken; }
	public int getHitsDeflected() { return hitsDeflected; }
	public int getWins() { return wins; }
	public int getLosses() { return losses; }
	
	public void setHitsTaken(int hitsTaken) {
		this.hitsTaken = hitsTaken;
	}

	public void setHitsGiven(int hitsGiven) {
		this.hitsGiven = hitsGiven;
	}

	public void setHitsDeflected(int hitsDeflected) {
		this.hitsDeflected = hitsDeflected;
	}

	public void setWins(int wins) {
		this.wins = wins;
	}

	public void setLosses(int losses) {
		this.losses = losses;
	}

	public void increaseHitsGiven(int amount)
	{
		hitsGiven += amount;
	}
	public void increaseHitsTaken(int amount)
	{
		hitsTaken += amount;
	}
	
	public void increaseHitsDeflected(int amount)
	{
		hitsDeflected += amount;
	}
	public void increaseWins(int amount)
	{
		wins += amount;
	}
	public void increaseLosses(int amount)
	{
		losses += amount;
	}
}
