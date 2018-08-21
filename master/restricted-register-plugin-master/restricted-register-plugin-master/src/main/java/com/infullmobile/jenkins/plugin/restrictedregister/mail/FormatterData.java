package com.infullmobile.jenkins.plugin.restrictedregister.mail;

import javax.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Adam Kobus on 31.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class FormatterData {

    private final List<Object> inputData = new ArrayList<>();

    public synchronized void addInputData(Object object) {
        if (object == null) {
            throw new NullPointerException("Object cannot be null");
        }
        final Object existingOfSameType = getDataForType(object.getClass());
        if (existingOfSameType != null) {
            throw new IllegalStateException("Cannot add input data for same type twice (" + object.getClass() + ")");
        }
        this.inputData.add(object);
    }

    @Nullable
    public synchronized <T> T getDataForType(Class<T> type) {
        for (Object object : inputData) {
            if (type.isInstance(object)) {
                //noinspection unchecked
                return (T) object;
            }
        }
        return null;
    }
}
