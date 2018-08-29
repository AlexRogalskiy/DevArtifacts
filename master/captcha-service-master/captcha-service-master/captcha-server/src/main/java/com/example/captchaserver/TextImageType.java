package com.example.captchaserver;

public class TextImageType extends AbstractImageType {
    private String text;

    public TextImageType() {}

    public TextImageType(String text) {
        setText(text);
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }
}
