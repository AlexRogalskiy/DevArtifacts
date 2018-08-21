package com.infullmobile.jenkins.plugin.restrictedregister.mail.data;

import org.apache.commons.lang.StringUtils;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class Footer {

    private final String content;

    public Footer(String content) {
        this.content = content;
    }

    public boolean isEmpty() {
        return StringUtils.isEmpty(content);
    }

    public String getContent() {
        return content;
    }
}
