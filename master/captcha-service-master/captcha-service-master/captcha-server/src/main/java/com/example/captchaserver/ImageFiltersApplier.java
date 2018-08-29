package com.example.captchaserver;

import java.awt.image.BufferedImage;
import java.awt.image.ColorModel;
import java.awt.image.WritableRaster;
import java.util.List;

public class ImageFiltersApplier {
    public static Image applyFilters(Image image, List<ImageFilterInterface> filters) {
        for (ImageFilterInterface filter : filters) {
            image.setContent(filter.applyFilter(image.content()));
        }
        return image;
    }

    private BufferedImage imageCopy(BufferedImage bi) {
        ColorModel cm = bi.getColorModel();
        boolean isAlphaPremultiplied = cm.isAlphaPremultiplied();
        WritableRaster raster = bi.copyData(null);
        return new BufferedImage(cm, raster, isAlphaPremultiplied, null);
    }
}
