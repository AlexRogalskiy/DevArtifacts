package com.ubs.network.api.rest.services.artifactory.model.entities;

import com.ubs.network.api.rest.common.model.entities.BaseEntity;

public class BuildEntity extends BaseEntity {

    private Long id;
    private String quote;

    public Long getId() {
        return this.id;
    }

    public String getQuote() {
        return this.quote;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuote(String quote) {
        this.quote = quote;
    }

    @Override
    public String toString() {
        return "BuildEntity{" +
                "id=" + id +
                ", quote='" + quote + '\'' +
                '}';
    }
}
