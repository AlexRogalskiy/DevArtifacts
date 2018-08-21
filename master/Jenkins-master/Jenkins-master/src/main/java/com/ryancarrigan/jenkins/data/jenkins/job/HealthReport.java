package com.ryancarrigan.jenkins.data.jenkins.job;

import org.jdom2.Element;

/**
 * Created by Suave Peanut on 2014.5.23.
 */
public class HealthReport {

    private final Integer score;
    private final String description;
    private final String iconUrl;

    public HealthReport(final Element healthReport) {
        this.score = Integer.valueOf(healthReport.getChildText("score"));
        this.description = healthReport.getChildText("description");
        this.iconUrl = healthReport.getChildText("iconUrl");
    }

    public Integer getScore() {
        return score;
    }

    public String getDescription() {
        return description;
    }

    public String getIconUrl() {
        return iconUrl;
    }

}
