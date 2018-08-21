package com.ubs.api.rest.artifactory.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ubs.api.rest.artifactory.model.interfaces.IBuildEntity;
import com.ubs.api.rest.common.model.BaseEntity;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BuildEntity extends BaseEntity implements IBuildEntity {

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
