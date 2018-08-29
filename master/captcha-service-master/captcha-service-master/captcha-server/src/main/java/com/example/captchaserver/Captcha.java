package com.example.captchaserver;

import org.json.JSONObject;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.UUID;

public class Captcha implements FactoryObject {
    private String captchaUUIDAttribute   = "request";
    private String captchaAnswerAttribute = "answer";

    private String captchaAnswer;
    private int textLen = 7;

    private Image image;
    private UUID  uuid;

    private LocalDateTime creationDate;

    private TextImageGenerator<TextImageType> generator;

    public Captcha(TextImageGenerator<TextImageType> generator, UUID uuid) {
        this.uuid      = uuid;
        this.generator = generator;

        creationDate = LocalDateTime.now();

        generate();
    }

    public String getId() {
        return uuid.toString();
    }

    public Image getImage() {
        return image;
    }

    public String getCaptchaAnswer() {
        return captchaAnswer;
    }

    public Duration getLiveTime() {
        LocalDateTime nowTime = LocalDateTime.now();
        Duration duration = Duration.between(creationDate, nowTime);
        return duration;
    }

    public JSONObject toJson() {
        JSONObject object = new JSONObject().put(captchaUUIDAttribute, uuid.toString());
        if (!CommandLineArguments.getProduction())
                object.put(captchaAnswerAttribute, captchaAnswer);
        return object;
    }

    private void generate() {
        captchaAnswer = TextGenerator.generateText(textLen);
        image = generator.generateImage(new TextImageType(captchaAnswer));
        image = ImageFiltersApplier.applyFilters(image, Arrays.asList(new NoiseFilter()));
    }
}
