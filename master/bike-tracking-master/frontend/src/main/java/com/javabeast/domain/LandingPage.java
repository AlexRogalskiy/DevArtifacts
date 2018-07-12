package com.javabeast.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LandingPage {
    private String url;
    private String display;
    private String metaDescription;
    private String title;
    private String hero1;
    private String hero2;
    private String heroBlurb;
    private String buyButton;
    private String moreButton;
    private String feature1header;
    private String feature1body;
    private String feature2header;
    private String feature2body;
    private String heroImage;

    public String getFullUrl() {
        return "/featured/" + url;
    }
}
