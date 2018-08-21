package com.ryancarrigan.jenkins.data.jenkins.job;

import org.jdom2.Element;

/**
 * Created by Suave Peanut on 2014.5.23.
 */
public class Module {

    private final String color;
    private final String displayName;
    private final String name;
    private final String url;

    public Module(final Element module) {
        this.color = module.getChildText("color");
        this.displayName = module.getChildText("displayName");
        this.name = module.getChildText("name");
        this.url = module.getChildText("url");
    }

    public String getColor() {
        return color;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getName() {
        return name;
    }

    public String getUrl() {
        return url;
    }

}
