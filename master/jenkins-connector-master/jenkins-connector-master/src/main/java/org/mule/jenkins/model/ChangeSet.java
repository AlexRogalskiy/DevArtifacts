/**
 *
 * Copyright (c) MuleSoft, Inc.  All rights reserved.  http://www.mulesoft.com
 *
 * The software in this package is published under the terms of the CPAL v1.0
 * license, a copy of which has been included with this distribution in the
 * LICENSE.txt file.
 */

package org.mule.jenkins.model;

import java.io.Serializable;

public class ChangeSet implements Serializable {
    private ChangeSetItem[] items;
    private Object kind;

    public ChangeSetItem[] getItems() {
        return items;
    }

    public void setItems(ChangeSetItem[] items) {
        this.items = items;
    }

    public Object getKind() {
        return kind;
    }

    public void setKind(Object kind) {
        this.kind = kind;
    }
}
