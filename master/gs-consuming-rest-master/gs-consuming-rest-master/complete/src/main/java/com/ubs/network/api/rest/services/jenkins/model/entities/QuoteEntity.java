package com.ubs.network.api.rest.services.jenkins.model.entities;

import com.ubs.network.api.rest.common.model.entities.BaseEntity;

public class QuoteEntity extends BaseEntity {

    private String type;
    private BuildEntity value;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BuildEntity getValue() {
        return value;
    }

    public void setValue(BuildEntity value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "QuoteEntity{" +
                "type='" + type + '\'' +
                ", value=" + value +
                '}';
    }
}
