/**
 *
 * Copyright (c) MuleSoft, Inc.  All rights reserved.  http://www.mulesoft.com
 *
 * The software in this package is published under the terms of the CPAL v1.0
 * license, a copy of which has been included with this distribution in the
 * LICENSE.txt file.
 */

package org.mule.jenkins.model;

public class QueueItem {
    private Actions[] actions;
    private boolean blocked;
    private boolean buildable;
    private Integer id;
    private Long inQueueSince;
    private String params;
    private boolean stuck;
    private QueueItemTask task;
    private String why;
    private Long timestamp;

    public Actions[] getActions() {
        return actions;
    }

    public void setActions(Actions[] actions) {
        this.actions = actions;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public boolean isBuildable() {
        return buildable;
    }

    public void setBuildable(boolean buildable) {
        this.buildable = buildable;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getInQueueSince() {
        return inQueueSince;
    }

    public void setInQueueSince(Long inQueueSince) {
        this.inQueueSince = inQueueSince;
    }

    public String getParams() {
        return params;
    }

    public void setParams(String params) {
        this.params = params;
    }

    public boolean isStuck() {
        return stuck;
    }

    public void setStuck(boolean stuck) {
        this.stuck = stuck;
    }

    public QueueItemTask getTask() {
        return task;
    }

    public void setTask(QueueItemTask task) {
        this.task = task;
    }

    public String getWhy() {
        return why;
    }

    public void setWhy(String why) {
        this.why = why;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}
