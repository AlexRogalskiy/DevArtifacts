package com.example.captchaserver;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.Random;


public class TextImageGenerator<ImageType extends TextImageType> extends AbstractImageGenerator<ImageType> {
    private Random rand;
    private int textLen;

    private String textBuffer;

    public TextImageGenerator(int width, int height) {
        super(width, height);

        rand = new Random();
        textLen = 7;
    }

    private Graphics2D initGraphics(Graphics2D graphics) {
        RenderingHints rh = new RenderingHints(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        GradientPaint gp  = new GradientPaint(0, 0, new Color(234, 255, 99),
                0, this.height/2, new Color(68, 255, 109), true);
        rh.put(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

        graphics.setFont(new Font("Courier New", Font.BOLD, 30));
        graphics.setRenderingHints(rh);
        graphics.setPaint(gp);

        return graphics;
    }

    private void drawText(Graphics2D graphics, String text) {
        int x = 0, y = 0;

        for (int i = 0; i < text.length(); i++) {
            x += 13 + Math.abs(rand.nextInt()) % 15;
            y = 25 + Math.abs(rand.nextInt()) % 20;
            graphics.drawChars(text.toCharArray(), i, 1, x, y);
        }
        graphics.dispose();
    }

    public void drawImage(Graphics2D graphics, ImageType properties) {
        graphics.fillRect(0, 0, this.width, this.height);
        graphics.setColor(Color.MAGENTA);

        drawText(graphics, properties.getText());
    }

    public Image generateImage(ImageType properties) {
        BufferedImage bufImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        drawImage(initGraphics(bufImage.createGraphics()), properties);
        return new Image(bufImage);
    }
}
