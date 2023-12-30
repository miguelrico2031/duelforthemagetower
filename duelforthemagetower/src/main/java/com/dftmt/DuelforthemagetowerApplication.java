package com.dftmt;

import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.WebSocketSession;


@SpringBootApplication
@EnableWebSocket
public class DuelforthemagetowerApplication implements WebSocketConfigurer
{

	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry)
	{
		registry.addHandler(matchHandler(), "").setAllowedOrigins("*");
	}
	
	@Bean
	public WebSocketMatchHandler matchHandler()
	{
		return new WebSocketMatchHandler();
	}

   @Bean
    public ScheduledExecutorService sessionTimeoutChecker()
   {
        ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
        executorService.scheduleAtFixedRate(() -> matchHandler().checkSessions(), 0, 1, TimeUnit.SECONDS); // Verifica cada segundo
        return executorService;
    }

	public static void main(String[] args)
	{
		SpringApplication.run(DuelforthemagetowerApplication.class, args);
	}
}
