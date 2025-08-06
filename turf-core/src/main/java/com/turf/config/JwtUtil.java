package com.turf.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

/**
 * Utility class for generating and validating JWT tokens.
 *
 * @author Kaviya Ramamoorthy
 */
@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    private static final String SECRET = "turf-booking-super-secret-key-should-be-long-and-secure";
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours
    private static final Key KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_MS);
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
        logger.info("Generated JWT for {}", username);
        return token;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(KEY).build().parseClaimsJws(token).getBody();
    }

    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        boolean valid = (extractedUsername.equals(username) && !isTokenExpired(token));
        logger.info("JWT validation for {}: {}", username, valid);
        return valid;
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
} 