package com.infullmobile;

import java.util.Calendar;
import java.util.Date;
import java.util.Random;

/**
 * Created by Adam Kobus on 02.06.2016.
 * Copyright (c) 2016 inFullMobile
 * License: MIT, file: /LICENSE
 */
public class ExpectedDate {

    public final int expectedYear;
    public final int expectedMonth;
    public final int expectedDayOfMonth;

    public final int expectedHour;
    public final int expectedMinute;
    public final int expectedSecond;

    private final Calendar expectedCalendar;
    private final Random random;

    public ExpectedDate(Random random) {
        this.random = random;

        final Calendar calendar = Calendar.getInstance();

        configureCalendar(calendar, Calendar.YEAR,
                Calendar.MONTH,
                Calendar.DAY_OF_MONTH,
                Calendar.HOUR_OF_DAY,
                Calendar.MINUTE,
                Calendar.SECOND);

        this.expectedYear = calendar.get(Calendar.YEAR);
        this.expectedMonth = calendar.get(Calendar.MONTH);
        this.expectedDayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);

        this.expectedHour = calendar.get(Calendar.HOUR_OF_DAY);
        this.expectedMinute = calendar.get(Calendar.MINUTE);
        this.expectedSecond = calendar.get(Calendar.SECOND);

        this.expectedCalendar = calendar;
    }

    private void configureCalendar(Calendar calendar, int... fields) {
        for (int field : fields) {
            configureField(calendar, field);
        }
    }

    private void configureField(Calendar calendar, int field) {
        final int min = calendar.getActualMinimum(field);
        final int max = calendar.getActualMaximum(field);
        final int value = getRandomValue(min, max);
        calendar.set(field, value);
    }

    private int getRandomValue(int min, int max) {
        if (min >= max) {
            return min;
        }
        return min + random.nextInt(max - min + 1);
    }

    public Calendar getExpectedCalendar() {
        return (Calendar) this.expectedCalendar.clone();
    }

    public Date toDate() {
        return expectedCalendar.getTime();
    }
}
