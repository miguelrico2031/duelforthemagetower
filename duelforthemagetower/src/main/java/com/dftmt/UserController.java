package com.dftmt;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController
{
	@Autowired
	private UserService userService;
	
	@PostMapping("/signup")
	public ResponseEntity<GameUser> signUp(@RequestBody GameUser user)
	{
		user = userService.signUp(user);
		
		if(user == null)
		{
			//error de usuario ya existente
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		//usuario creado
		return new ResponseEntity<>(user, HttpStatus.CREATED);
	}
	
	@PostMapping("/login")
	public ResponseEntity<GameUser> logIn(@RequestBody GameUser user)
	{
		List<GameUser> loggedUsers = userService.getLoggedUsers();
		
		for (GameUser loggedUser : loggedUsers) {
	        if (Objects.equals(loggedUser.getUsername(), user.getUsername())) {
	            // usuario ya logueado
	            return new ResponseEntity<>(HttpStatus.CONFLICT);
	        }
	    }
		
		user = userService.logIn(user);

		if(user == null)
		{
			//error de usuario no existente
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		//usuario loggeado
		return new ResponseEntity<>(user, HttpStatus.OK);
	}
	
	@PostMapping("/logout")
	public ResponseEntity<GameUser> logOut(@RequestBody GameUser user)
	{
		user = userService.logOut(user);
		
		if(user == null)
		{
			//error de usuario no existente
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		//usuario desloggeado
		return new ResponseEntity<>(user, HttpStatus.OK);
	}
	
	@PutMapping("/changepassword")
	public ResponseEntity<GameUser> changePassword(@RequestBody GameUser user)
	{
		user = userService.changePassword(user);
		
		if(user == null)
		{
			//error de usuario no existente o no loggeado
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		//usuario con contraseña cambiada
		return new ResponseEntity<>(user, HttpStatus.OK);
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<GameUser> deleteUser(@RequestBody GameUser user)
	{
		user = userService.deleteUser(user);
		
		if(user == null)
		{
			//error de usuario no existente o no loggeado
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		//usuario eliminado
		return new ResponseEntity<>(user, HttpStatus.OK);
	}
	
	
}

