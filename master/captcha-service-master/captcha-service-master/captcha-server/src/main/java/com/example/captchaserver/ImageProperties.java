package com.example.captchaserver;

import java.util.HashMap;

public class ImageProperties<PropertiesType> {
    private PropertiesType properties;

    public ImageProperties(PropertiesType properties) {
        this.properties = properties;
    }

    public PropertiesType getProperties() {
        return properties;
    }
}
