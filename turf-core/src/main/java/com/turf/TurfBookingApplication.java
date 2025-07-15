package com.turf;

import com.turf.entity.User;
import com.turf.entity.Role;
import com.turf.entity.UserRole;
import com.turf.repository.UserRepository;
import com.turf.repository.RoleRepository;
import com.turf.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import java.util.UUID;

/**
 * Main application class for Turf Booking Platform.
 *
 * @author Saravanamuthukumar S
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
	public CommandLineRunner seedAdmin(UserRepository userRepository, RoleRepository roleRepository, UserRoleRepository userRoleRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Ensure ADMIN role exists
			Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() -> {
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
				admin.setVerified(true);
				admin.setActive(true);
				admin = userRepository.save(admin);
				// Assign ADMIN role
				UserRole userRole = new UserRole();
				userRole.setUser(admin);
				userRole.setRole(adminRole);
				userRoleRepository.save(userRole);
				System.out.println("Seeded admin user: " + adminEmail + " / " + adminPassword);
			}
		};
	}
}
