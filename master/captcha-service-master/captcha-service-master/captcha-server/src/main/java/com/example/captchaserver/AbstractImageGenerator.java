package com.example.captchaserver;

import java.awt.*;

public abstract class AbstractImageGenerator<T extends AbstractImageType> {
    protected int width;
    protected int height;

    public abstract void drawImage(Graphics2D graphics, T properties);
    public abstract Image generateImage(T properties);

    public AbstractImageGenerator(int width, int height) {
        this.width  = width;
        this.height = height;
    }
}
