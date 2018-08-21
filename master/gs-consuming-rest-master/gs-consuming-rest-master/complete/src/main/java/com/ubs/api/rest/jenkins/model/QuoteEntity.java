package com.ubs.api.rest.jenkins.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ubs.api.rest.common.model.BaseEntity;
import com.ubs.api.rest.jenkins.model.interfaces.IQuoteEntity;

@JsonIgnoreProperties(ignoreUnknown = true)
public class QuoteEntity extends BaseEntity implements IQuoteEntity {

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
