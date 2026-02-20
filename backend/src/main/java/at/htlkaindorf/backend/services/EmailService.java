package at.htlkaindorf.backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.expiryInHours}")
    private Long expiryInHours;

    public void sendVerificationEmail(String toEmail, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(toEmail);
        msg.setSubject("Verify E-Mail");
        msg.setText("Please verify your e-mail:\n\n"
                + frontendUrl + "/verify-email?token=" + token
                + "\n\nThis link will expire in " + expiryInHours + " hours.");
        mailSender.send(msg);
    }

    public void sendInvitationEmail(String toEmail, String token, String tenantName, String role, String tempPassword) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(toEmail);
        msg.setSubject("You have been invited to " + tenantName);
        msg.setText(
                "You have been invited to join \"" + tenantName + "\" as " + role + ".\n\n" +
                        "Your temporary password: " + tempPassword + "\n\n" +
                        "Please verify your email and log in:\n" +
                        frontendUrl + "/verify-email?token=" + token +
                        "\n\nThis link will expire in " + expiryInHours + " hours.\n\n" +
                        "After logging in, please change your password immediately."
        );
        mailSender.send(msg);
    }
}
