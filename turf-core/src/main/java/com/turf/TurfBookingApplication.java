package com.turf;

import com.turf.entity.User;
import com.turf.entity.Role;
import com.turf.repository.UserRepository;
import com.turf.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import java.time.LocalDateTime;

/**
 * Main application class for Turf Booking Platform.
 *
 * @author Kaviya Ramamoorthy
 */
@SpringBootApplication
public class TurfBookingApplication {

	@Value("${app.admin.email}")
	private String adminEmail;
	@Value("${app.admin.password}")
	private String adminPassword;

	public static void main(String[] args) {
		SpringApplication.run(TurfBookingApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedAdmin(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
					return args -> {
			// Ensure ADMIN role exists in roles table (for reference)
			roleRepository.findByName("ADMIN").orElseGet(() -> {
				Role r = new Role();
				r.setName("ADMIN");
				return roleRepository.save(r);
			});
			// Ensure admin user exists
			Optional<User> adminOpt = userRepository.findByEmail(adminEmail);
			if (adminOpt.isEmpty()) {
				User admin = new User();
				admin.setFullName("Admin");
				admin.setEmail(adminEmail);
				admin.setPasswordHash(passwordEncoder.encode(adminPassword));
				admin.setPhoneNumber("0000000000");
				admin.setRole("ADMIN");
				admin.setVerified(true);
				admin.setActive(true);
				admin.setCreatedAt(java.time.LocalDateTime.now());
				admin.setUpdatedAt(java.time.LocalDateTime.now());
				userRepository.save(admin);
				System.out.println("Seeded admin user: " + adminEmail + " / " + adminPassword);
			}
		};
	}
}
