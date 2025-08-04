package com.turf.service.impl;

import com.turf.service.OtpService;
import com.turf.constants.CommonConstants;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.security.SecureRandom;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Implementation of OtpService using in-memory ConcurrentHashMap for OTP storage and expiry.
 *
 * @author Kaviya Ramamoorthy
 */
@Service
public class OtpServiceImpl implements OtpService {
    private static final Logger logger = LoggerFactory.getLogger(OtpServiceImpl.class);
    private static final SecureRandom random = new SecureRandom();

    @Autowired(required = false)
    private JavaMailSender mailSender;

    private static class OtpEntry {
        String otp;
        LocalDateTime expiry;
        OtpEntry(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    @Override
    public void generateOtp(String email, String purpose) {
        String otp = String.format("%06d", random.nextInt(1000000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(CommonConstants.OTP_EXPIRY_MINUTES);
        otpStore.put(getKey(email, purpose), new OtpEntry(otp, expiry));
        logger.info("Generated OTP for {} (purpose: {}), expires at {}", email, purpose, expiry);
        logger.info("=== DEVELOPMENT MODE: OTP for {} is {} ===", email, otp);
        // Send OTP email
        try {
            if (mailSender == null) {
                logger.warn("Mail sender not configured - skipping email sending");
                logger.info("=== DEVELOPMENT MODE: OTP for {} is: {} ===", email, otp);
                return;
            }
            
            logger.info("Attempting to send OTP email to {}", email);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setFrom("kaviya.ramamoorthy@ideas2it.com");
            helper.setSubject("Turf Booking - Your OTP Code");
            helper.setText("Your OTP for Turf Booking registration is: " + otp + 
                          ". It will expire in " + CommonConstants.OTP_EXPIRY_MINUTES + " minutes." +
                          "\n\nIf you didn't request this OTP, please ignore this email.");
            
            mailSender.send(message);
            logger.info("✅ OTP email successfully sent to {}", email);
        } catch (Exception e) {
            logger.error("❌ Failed to send OTP email to {}: {}", email, e.getMessage());
            logger.error("Email error details: ", e);
            logger.info("=== DEVELOPMENT MODE: OTP for {} is: {} ===", email, otp);
        }
    }

    @Override
    public boolean validateOtp(String email, String otp, String purpose) {
        String key = getKey(email, purpose);
        OtpEntry entry = otpStore.get(key);
        if (entry == null) {
            logger.warn("No OTP found for {} (purpose: {})", email, purpose);
            return false;
        }
        if (LocalDateTime.now().isAfter(entry.expiry)) {
            logger.warn("OTP expired for {} (purpose: {})", email, purpose);
            otpStore.remove(key);
            return false;
        }
        boolean valid = entry.otp.equals(otp);
        if (valid) {
            logger.info("OTP validated for {} (purpose: {})", email, purpose);
            otpStore.remove(key);
        } else {
            logger.warn("Invalid OTP for {} (purpose: {})", email, purpose);
        }
        return valid;
    }

    @Override
    public void removeOtp(String email, String purpose) {
        otpStore.remove(getKey(email, purpose));
        logger.info("OTP removed for {} (purpose: {})", email, purpose);
    }

    private String getKey(String email, String purpose) {
        return email + ":" + purpose;
    }
} 