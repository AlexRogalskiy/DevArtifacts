package com.example.captchaserver;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.WritableRaster;
import java.util.Random;

public class NoiseFilter implements ImageFilterInterface {
    private int randNumRange = 10;
    private int colorRange   = 256;
    private int emptyProbability = 15;

    public NoiseFilter() {}

    public BufferedImage applyFilter(BufferedImage image) {
        Random rand = new Random();
        for (int row=0; row < image.getWidth(); row++) {
            for (int col=0; col < image.getHeight(); col++) {
                Color newPixel = getNoisedPixel(rand, new Color(image.getRGB(row, col)));
                image.setRGB(row, col, newPixel.getRGB());
            }
        }
        return image;
    }

    private Color getNoisedPixel(Random rand, Color pixel) {
        int newRed    = getNoisedNumber(rand, pixel.getRed());
        int newGreen  = getNoisedNumber(rand, pixel.getGreen());
        int newBlue   = getNoisedNumber(rand, pixel.getBlue());
        return new Color(newRed, newGreen, newBlue);
    }

    private int getNoisedNumber(Random rand, int num) {
        int choice = rand.nextInt() % emptyProbability;
        if (choice == 0)
            return (num + rand.nextInt() % randNumRange + colorRange) % colorRange;
        else if (choice == 1)
            return (num - rand.nextInt() % randNumRange + colorRange) % colorRange;
        else
            return num;
    }
}
