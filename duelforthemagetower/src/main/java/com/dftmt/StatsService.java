package com.dftmt;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

@Service
public class StatsService
{
	@Autowired
    private UserService userService;
	
	private HashMap<String, UserStats> stats;
	private final String filePath = System.getProperty("user.dir") + "/src/main/resources/data/stats.txt";
	
	public UserStats getStats(GameUser user)
	{
		if(user == null) return null;
		return getStats(user.getUsername());
	}
	
	public UserStats getStats(String username)
	{
		if(stats == null) loadStats();
		if(stats.containsKey(username)) return stats.get(username);
		
		if(userService.getUser(username) != null)
		{
			UserStats newStats = new UserStats(username, 0, 0);
			stats.put(username, newStats);
			return newStats;
		}
		
		return null;
	}
	
	public UserStats setStats(UserStats stat)
	{
		if(stats == null) loadStats();
		if(stat == null) return null;
		
		UserStats existingStat = getStats(stat.getUsername());
		if(existingStat == null) return null;
		
		existingStat.copyStats(stat);
		saveStats();
		return existingStat;
	}
	
	public UserStats increaseStats(UserStats stat)
	{
		if(stats == null) loadStats();
		if(stat == null) return null;
		
		UserStats existingStat = getStats(stat.getUsername());
		if(existingStat == null) return null;
		
		existingStat.increaseStat1(stat.getStat1());
		existingStat.increaseStat2(stat.getStat2());
		
		saveStats();
		return existingStat;
	}
	
	public UserStats deleteStats(GameUser user)
	{
		if(stats == null) loadStats();
		if(user == null) return null;
		
		UserStats existingStat = getStats(user.getUsername());
		if(existingStat == null) return null;
		
		stats.remove(existingStat.getUsername());
		
		saveStats();
		return existingStat;
	}
	
	private void printStats()
	{
		if(stats == null) loadStats();
		
		System.out.println("\nSTATS:");
		for (String key: stats.keySet()) {
		    UserStats value = stats.get(key);
		    System.out.println(key + " -> stat1: " + 
		    value.getStat1() + " -> stat2: " + value.getStat2());
		}
	}
	
	
	public void saveStats()
	{
	    ObjectMapper objectMapper = new ObjectMapper();

	    try
	    {
	        // Guardar el JSON en un archivo
	        File file = new File(filePath);
	        objectMapper.writeValue(file, stats);
	        System.out.println("Estadisticas guardadas en " + filePath);
	    }
	    catch (IOException e)
	    {
	    	System.out.println("Error al guardar fichero de estadisticas: " + e.getMessage());
	    }
    }
	
	public void loadStats()
	{
        ObjectMapper objectMapper = new ObjectMapper();

        // Cargar el JSON desde el archivo
        File file = new File(filePath);
        
        try
        {
            if (!file.exists()) stats = new HashMap<>();
            stats = objectMapper.readValue( file, new TypeReference<HashMap<String, UserStats>>() { }); 
            System.out.println("Estadisticas cargadas desde " + filePath);
            printStats();
        }
        catch (IOException e)
        {
        	System.out.println("Error al leer fichero de estadisticas: " + e.getMessage());
            stats =  new HashMap<>();
        }
    }
	

}
