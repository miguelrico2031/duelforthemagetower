package com.dftmt;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class DuelforthemagetowerApplication implements WebSocketConfigurer
{

	//metodo para asignar el handler al registro
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry)
	{
		registry.addHandler(matchHandler(), "/match").setAllowedOrigins("*");
	}
	
	//metodo para crear el handler y usarlo
	@Bean
	public WebSocketMatchHandler matchHandler()
	{
		return new WebSocketMatchHandler();
	}
	
	//metodo para llamar a updateSessions() del handler, una vez cada segundo
	@Bean
	public ScheduledExecutorService sessionTimeoutChecker()
	{
		ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
    	//executorService.scheduleAtFixedRate(() -> matchHandler().updateSessions(), 0, 1, TimeUnit.SECONDS);
		
		executorService.scheduleAtFixedRate(() -> {
		    try {
		        matchHandler().updateSessions();
		    } catch (Exception e) {
		        // Manejar la excepción según tus necesidades
		        System.out.println("Error del sheduled executor: " + e.getMessage());
		        e.printStackTrace();
		    }
		}, 0, 1, TimeUnit.SECONDS);
		
    	return executorService;
    }

	public static void main(String[] args)
	{
		SpringApplication.run(DuelforthemagetowerApplication.class, args);
	}
}
