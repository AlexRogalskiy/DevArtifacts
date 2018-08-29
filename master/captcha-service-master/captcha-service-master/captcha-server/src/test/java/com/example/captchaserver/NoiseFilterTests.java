package com.example.captchaserver;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.awt.*;
import java.awt.image.BufferedImage;

import static org.junit.Assert.*;


@RunWith(SpringRunner.class)
@SpringBootTest
public class NoiseFilterTests {
    private int imageWidth  = 200;
    private int imageHeight = 200;

    private NoiseFilter filter = new NoiseFilter();

    @Test
    public void testFilterApplying() {
        long notEqualsCount = 0;
        BufferedImage image = generateBlackPicture();
        filter.applyFilter(image);

        for (int row = 0; row < image.getWidth(); row++)
            for (int col = 0; col < image.getHeight(); col++)
                if (!Color.BLACK.equals(new Color(image.getRGB(row, col))))
                    notEqualsCount++;
        assertNotEquals(0, notEqualsCount);
    }

    @Test
    public void testIfImageIsBlack() {
        BufferedImage image = generateBlackPicture();
        for (int row = 0; row < image.getWidth(); row++)
            for (int col=0; col < image.getHeight(); col++)
                assertEquals(Color.BLACK, new Color(image.getRGB(row, col)));
    }

    private BufferedImage generateBlackPicture() {
        BufferedImage image = new BufferedImage(imageWidth, imageHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d      = image.createGraphics();

        g2d.setPaint(Color.BLACK);
        g2d.fillRect(0, 0, imageWidth, imageHeight);

        return image;
    }
}
