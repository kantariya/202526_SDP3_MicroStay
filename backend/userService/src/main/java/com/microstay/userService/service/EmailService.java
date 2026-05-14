package com.microstay.userService.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
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
            log.info("Email sent successfully to={} subject={}", to, subject);
        } catch (Exception e) {
            log.error("Failed to send email to={} subject={}", to, subject, e);
        }
    }

    @Async
    public void sendManagerCredentialsEmail(
            String to,
            String subject,
            String html
    ) {
        log.debug("Sending manager credentials email to={}", to);
        sendHtml(to, subject, html);
    }

}
