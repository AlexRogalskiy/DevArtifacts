package com.example.captchaserver;

import javax.imageio.ImageIO;
import javax.xml.bind.DatatypeConverter;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class Image {
    protected BufferedImage content;

    public Image(BufferedImage passedContent) {
        content = passedContent;
    }

    public BufferedImage content() {
        return content;
    }

    public void setContent(BufferedImage bufImage) {
        content = bufImage;
    }

    public String toBase64() {
        try {
            return DatatypeConverter.printBase64Binary(contentToBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }

    private byte[] contentToBytes() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(content, "png", baos);
        baos.flush();
        byte[] imageBytes = baos.toByteArray();
        baos.close();
        return imageBytes;
    }
}
