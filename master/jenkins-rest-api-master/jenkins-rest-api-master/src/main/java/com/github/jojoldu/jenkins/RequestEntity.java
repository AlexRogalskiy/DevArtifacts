package com.github.jojoldu.jenkins;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by dwlee on 2017. 4. 28..
 */
@Getter
@Setter
@NoArgsConstructor
public class RequestEntity {

    private String host;
    private String jobName;
    private String username;
    private String token;

    List<NameValue> parameters = new ArrayList<>();

    public RequestEntity(String host, String jobName, String username, String token) {
        this.host = host;
        this.jobName = jobName;
        this.username = username;
        this.token = token;
    }

    public void add(NameValue nameValue) {
        parameters.add(nameValue);
    }

    public String createUrl(){
        if(StringUtils.isEmpty(host)){
            throw new JenkinsExecuteException("host is Empty");
        }

        return host+templatePath()+toRequestParam();
    }

    private String templatePath(){
        if(StringUtils.isEmpty(jobName)){
            throw new JenkinsExecuteException("jobName is Empty");
        }

        if(parameters.isEmpty()){
            return UrlPath.BUILD.exchange(jobName);
        } else {
            return UrlPath.BUILD_WITH_PARAMETER.exchange(jobName);
        }
    }

    private String toRequestParam() {
        return parameters.stream()
                .map(p -> p.getName()+"="+p.getValue())
                .collect(Collectors.joining("&"));
    }
}
