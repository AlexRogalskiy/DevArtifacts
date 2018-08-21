package com.ubs.network.api.rest.core.model.entities;

import com.ubs.network.api.rest.common.model.entities.BaseEntity;

public class TaskUnitEntity extends BaseEntity {
    private Long id;
    private int totalVotes;
    private Collection<TaskEntity> results;

    public int getTotalVotes() {
        return totalVotes;
    }
    public void setTotalVotes(int totalVotes) {
        this.totalVotes = totalVotes;
    }
    public Collection<TaskEntity> getResults() {
        return results;
    }
    public void setResults(Collection<TaskEntity> results) {
        this.results = results;
    }
}
