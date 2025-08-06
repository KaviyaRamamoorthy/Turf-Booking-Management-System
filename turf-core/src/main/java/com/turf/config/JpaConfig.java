package com.turf.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * JPA Configuration for Turf Booking Application.
 * 
 * This configuration ensures proper entity scanning and repository setup
 * to avoid entity manager factory issues.
 *
 * @author Kaviya Ramamoorthy
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.turf.repository")
@EntityScan(basePackages = "com.turf.entity")
@EnableTransactionManagement
public class JpaConfig {
    // Configuration is handled by annotations and Spring Boot auto-configuration
}