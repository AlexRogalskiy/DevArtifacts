package com.example.captchaserver;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Base64;
import java.util.UUID;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CaptchaTests {
    @Test
    public void testCaptchaGeneration() {
        Captcha captcha = new Captcha(new TextImageGenerator<TextImageType>(100, 100), UUID.randomUUID());
        byte[] decodedImage;
        try {
            decodedImage = Base64.getDecoder().decode(captcha.getImage().toBase64());
        } catch (IllegalArgumentException e) {
            decodedImage = new byte[0];
        }
        assertNotEquals(null, captcha.getImage());
        assertNotEquals(0, decodedImage.length);
    }
}
