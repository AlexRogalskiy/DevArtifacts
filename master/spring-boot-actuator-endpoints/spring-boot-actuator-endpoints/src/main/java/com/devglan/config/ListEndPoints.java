package com.devglan.config;

import org.springframework.boot.actuate.endpoint.AbstractEndpoint;
import org.springframework.boot.actuate.endpoint.Endpoint;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Created by Kusumitha K on 10-02-2017.
 */
@Component
public class ListEndPoints extends AbstractEndpoint<List<Endpoint>> {
    private List<Endpoint> endpoints;

    public ListEndPoints(List<Endpoint> endpoints) {
        super("showendpoints");
        this.endpoints = endpoints;
    }

    @Override
    public List<Endpoint> invoke() {
        return this.endpoints;
    }
}
