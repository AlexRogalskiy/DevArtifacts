package ru.postlike.utils;


import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

/**
 * Utils
 */
public class ConsumerUtils {
    public static void log(String aMsg) {
        System.out.println(aMsg);
    }

    public static void sendAnEmail(String addressee, String text){
        final String username = "test@gmail.com";
        final String password = "krvplvfllizmeklu";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("test@gmail.com"));
            message.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(addressee));
            message.setSubject("Happy hours in McDonalds");
            message.setText(text);

            Transport.send(message);

            ConsumerUtils.log("Done");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
