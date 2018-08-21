package com.ubs.api.rest.jenkins.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ubs.api.rest.common.model.BaseEntity;
import com.ubs.api.rest.jenkins.model.interfaces.IJobEntity;

@JsonIgnoreProperties(ignoreUnknown = true)
public class JobEntity extends BaseEntity implements IJobEntity {

    private final long id;
    private final String content;

    public JobEntity(long id, String content) {
        this.id = id;
        this.content = content;
    }

    public long getId() {
        return id;
    }

    public String getContent() {
        return content;
    }
}