package com.turf.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 * Configuration for JavaMailSender with conditional loading
 * This prevents startup failures when email configuration is disabled
 */
@Configuration
public class MailConfig {

    @Value("${spring.mail.host}")
    private String host;
    
    @Value("${spring.mail.port}")
    private int port;
    
    @Value("${spring.mail.username}")
    private String username;
    
    @Value("${spring.mail.password}")
    private String password;

    @Bean
    @ConditionalOnProperty(name = "spring.mail.host", havingValue = "localhost", matchIfMissing = false)
    public JavaMailSender localhostMailSender() {
        // Return a dummy mail sender for development
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("localhost");
        mailSender.setPort(1025);
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "false");
        props.put("mail.smtp.starttls.enable", "false");
        props.put("mail.debug", "false");
        
        return mailSender;
    }
    
    @Bean
    @ConditionalOnProperty(name = "spring.mail.host", havingValue = "smtp.gmail.com")
    public JavaMailSender gmailMailSender() {
        // Gmail SMTP configuration
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "false");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        
        return mailSender;
    }
}