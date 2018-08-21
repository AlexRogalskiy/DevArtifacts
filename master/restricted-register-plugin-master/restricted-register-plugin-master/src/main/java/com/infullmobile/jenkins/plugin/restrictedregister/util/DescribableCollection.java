package com.infullmobile.jenkins.plugin.restrictedregister.util;

import hudson.model.Describable;
import hudson.model.Descriptor;
import net.sf.json.JSONObject;
import org.kohsuke.stapler.DataBoundSetter;

import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedList;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
@SuppressWarnings("NullableProblems")
public abstract class DescribableCollection<T extends Describable<T>, E extends Describable<E>>
        implements Describable<E>, Collection<T> {

    private LinkedList<T> data;

    @DataBoundSetter
    public void setData(LinkedList<T> data) {
        this.clear();
        this.addAll(data);
    }

    public LinkedList<T> getData() {
        if (data == null) {
            data = new LinkedList<>();
        }
        return data;
    }

    @SuppressWarnings("unused")
    public T get(Descriptor<T> descriptor) {
        for (T item : this) {
            if (descriptor.isInstance(item)) {
                return item;
            }
        }
        try {
            return descriptor.newInstance(null, new JSONObject());
        } catch (Descriptor.FormException e) {
            throw new AssertionError(e);
        }
    }

    @Override
    public int size() {
        return getData().size();
    }

    @Override
    public boolean isEmpty() {
        return getData().isEmpty();
    }

    @Override
    public boolean contains(Object o) {
        return getData().contains(o);
    }

    @Override
    public Iterator<T> iterator() {
        return getData().iterator();
    }

    @Override
    public Object[] toArray() {
        return getData().toArray();
    }

    @Override
    public <T1> T1[] toArray(T1[] a) {
        //noinspection SuspiciousToArrayCall
        return getData().toArray(a);
    }

    @Override
    public boolean add(T t) {
        return getData().add(t);
    }

    @Override
    public boolean remove(Object o) {
        return getData().remove(o);
    }

    @Override
    public boolean containsAll(Collection<?> c) {
        return getData().containsAll(c);
    }

    @Override
    public boolean addAll(Collection<? extends T> c) {
        return getData().addAll(c);
    }

    @Override
    public boolean removeAll(Collection<?> c) {
        return getData().removeAll(c);
    }

    @Override
    public boolean retainAll(Collection<?> c) {
        return getData().retainAll(c);
    }

    @Override
    public void clear() {
        getData().clear();
    }
}
