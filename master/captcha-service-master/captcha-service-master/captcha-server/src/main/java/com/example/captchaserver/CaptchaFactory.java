package com.example.captchaserver;

import java.util.UUID;

public class CaptchaFactory extends AbstractIndexingFactory {
    private int widht  = 180;
    private int height = 70;

    private TextImageGenerator<TextImageType> textedImageGenerator;

    public CaptchaFactory() {
        super();
        textedImageGenerator = new TextImageGenerator<>(widht, height);
    }

    @Override
    public FactoryObject createObject() {
        UUID uuid = generateUniqueUUID();
        Captcha captcha = new Captcha(textedImageGenerator, uuid);

        objects.put(uuid, captcha);
        return captcha;
    }
}
