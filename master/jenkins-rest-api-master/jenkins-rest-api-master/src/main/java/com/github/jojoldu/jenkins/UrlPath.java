package com.github.jojoldu.jenkins;

/**
 * Created by jojoldu@gmail.com on 2017. 7. 25.
 * Blog : http://jojoldu.tistory.com
 * Github : https://github.com/jojoldu
 */

public enum UrlPath {
    BUILD_WITH_PARAMETER("/job/{jobName}/buildWithParameters?"),
    BUILD("/job/{jobName}/build?");

    private String urlPath;

    UrlPath(String urlPath) {
        this.urlPath = urlPath;
    }

    public String exchange(final String jobName){
        return urlPath.replaceAll("\\{jobName\\}", jobName);
    }
}
