package com.ubs.network.api.rest.core.model.entities;

import com.ubs.network.api.rest.common.model.entities.BaseEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class TaskEntity extends BaseEntity {
    @Id
    @GeneratedValue
    @Column(name="OPTION_ID")
    private Long id;

    @Column(name="OPTION_VALUE")
    private String value;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getValue() {
        return value;
    }
    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return getId() + "," + getValue();
    }
}
