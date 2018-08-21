package com.ryancarrigan.jenkins.download;

/**
 * Created by Suave Peanut on 2014.5.23.
 */
public enum Depth {
    ZERO(0),
    ONE(1),
    TWO(2);

    private final Integer depth;
    private Depth(final Integer depth) {
        this.depth = depth;
    }

    protected Integer getDepth() {
        return depth;
    }
}
