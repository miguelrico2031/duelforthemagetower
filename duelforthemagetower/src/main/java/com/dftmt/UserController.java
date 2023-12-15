package com.dftmt;

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
	@PostMapping("/signup")
	public LoginUser signUp(@RequestBody LoginUser user)
	{
		if(!GameUser.signUp(user.username, user.password))
		{
			//error de usuario ya existente
			return null;
		}
		
		//usuario creado
		return user;
	}
	
	@PostMapping("/login")
	public LoginUser logIn(@RequestBody LoginUser user)
	{
		GameUser gameUser = GameUser.getUser(user.username);
		
		if(gameUser == null)
		{
			//error de usuario no existente
			return null;
		}
		
		if(!gameUser.logIn(user.password))
		{
			//error de contraseña incorrecta
			return null;
		}
		
		//usuario loggeado
		return user;
	}
	
	@PostMapping("/logout")
	public LoginUser logOut(@RequestBody LoginUser user)
	{
		GameUser gameUser = GameUser.getUser(user.username);
		
		if(gameUser == null)
		{
			//error de usuario no encontrado
			return null;
		}
		
		if(!gameUser.logOut())
		{
			//error de usuario no estaba loggeado
			return null;
		}
		
		//usuario desloggeado
		return user;
	}
	
	@PutMapping("/changepassword")
	public LoginUser changePassword(@RequestBody LoginUser user)
	{
		GameUser gameUser = GameUser.getUser(user.username);
		
		if(gameUser == null)
		{
			//error de usuario no encontrado
			return null;
		}
		
		if(!gameUser.isLogged())
		{
			//error usuario no loggeado
			return null;
		}
		
		if(!gameUser.changePassword(user.password))
		{
			//error de contraseña igual a anterior/nula
			return null;
		}
		
		//usuario cambio de contraseña
		return user;
	}
	
	@DeleteMapping("/delete")
	public LoginUser deleteUser(@RequestBody LoginUser user)
	{
		GameUser gameUser = GameUser.getUser(user.username);
		
		if(gameUser == null)
		{
			//error de usuario no encontrado
			return null;
		}
		
		if(!gameUser.deleteUser())
		{
			//error usuario no loggeado
			return null;
		}

		//usuario borrado
		return user;
	}
	
	
}

