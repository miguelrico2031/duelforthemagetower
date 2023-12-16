package com.dftmt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stats")
public class StatsController
{
	@Autowired
	private StatsService statsService;
	
	@GetMapping("/{username}")
	public ResponseEntity<UserStats> getStats(@PathVariable String username)
	{
		UserStats stat = statsService.getStats(username);
		if(stat == null)
		{
			//error de usuario no encontrado
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		return new ResponseEntity<>(stat, HttpStatus.OK);
	}
	
	@PutMapping("/set")
	public ResponseEntity<UserStats> setStats(@RequestBody UserStats stat)
	{
		stat = statsService.setStats(stat);
		if(stat == null)
		{
			//error de usuario no encontrado
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		return new ResponseEntity<>(stat, HttpStatus.OK);
	}
	
	@PutMapping("/increase")
	public ResponseEntity<UserStats> increaseStats(@RequestBody UserStats stat)
	{
		stat = statsService.increaseStats(stat);
		if(stat == null)
		{
			//error de usuario no encontrado
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		return new ResponseEntity<>(stat, HttpStatus.OK);
	}
	
	@DeleteMapping("/{username}")
	public ResponseEntity<UserStats> deleteStats(@PathVariable String username)
	{
		UserStats stat = statsService.deleteStats(username);
		if(stat == null)
		{
			//error de usuario no encontrado
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		return new ResponseEntity<>(stat, HttpStatus.OK);	
	}
	
	
	
	
}
