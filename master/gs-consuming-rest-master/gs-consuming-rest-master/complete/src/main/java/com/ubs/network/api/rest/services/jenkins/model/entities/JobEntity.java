package com.ubs.network.api.rest.services.jenkins.model.entities;

import com.ubs.network.api.rest.common.model.entities.BaseEntity;

public class JobEntity extends BaseEntity {

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