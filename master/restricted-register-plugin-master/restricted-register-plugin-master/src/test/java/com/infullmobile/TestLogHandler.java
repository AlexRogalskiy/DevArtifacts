package com.infullmobile;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;

/**
 * Created by Adam Kobus on 24.05.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class TestLogHandler extends Handler {

    private final List<LogRecord> records = new LinkedList<>();

    @Override
    public void publish(LogRecord record) {
        synchronized (records) {
            records.add(record);
        }
    }

    @Override
    public void flush() {

    }

    public boolean isMessagePresent(Level level, String message) {
        final List<LogRecord> consumedRecords = consume();
        for (LogRecord record : consumedRecords) {
            if (level.equals(record.getLevel()) && record.getMessage().contains(message)) {
                return true;
            }
        }
        return false;
    }

    private List<LogRecord> consume() {
        synchronized (records) {
            final List<LogRecord> ret = new ArrayList<>(records.size());
            ret.addAll(records);
            clear();
            return ret;
        }
    }

    public void clear() {
        synchronized (records) {
            records.clear();
        }
    }

    @Override
    public void close() throws SecurityException {
        synchronized (records) {
            records.clear();
        }
    }
}
