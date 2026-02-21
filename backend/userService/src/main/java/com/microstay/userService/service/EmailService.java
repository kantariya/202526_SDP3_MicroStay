package com.microstay.userService.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender sender;

    @Async
    public void sendHtml(String to, String subject, String html) {
        try {
            MimeMessage msg = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);
            helper.setFrom("MicroStay <yourgmail@gmail.com>");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            sender.send(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Async
    public void sendManagerCredentialsEmail(
            String to,
            String name,
            String tempPassword
    ) {

        String html = """
        <h2>Hotel Manager Account Created</h2>
        <p>Hello %s,</p>

        <p>Your manager account has been created by Admin.</p>

        <p><b>Email:</b> %s</p>
        <p><b>Temporary Password:</b> %s</p>

        <p>Please login and change your password immediately.</p>

        <br>
        <p>MicroStay Team</p>
        """.formatted(name, to, tempPassword);

        sendHtml(to, "Manager Account Created", html);
    }

}
