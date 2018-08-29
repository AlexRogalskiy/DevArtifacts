package com.example.captchaserver;

public class CommandLineArguments {
    private static int timeForAnswer  = 60;
    private static Boolean production = false;

    public static Boolean setTimeForAnswer(String ttl) {
        int value = Integer.parseInt(ttl);
        if (value < 0) {
            return false;
        }
        timeForAnswer = value;
        return true;
    }

    public static int getTimeForAnswer() {
        return timeForAnswer;
    }

    public static Boolean setProduction() {
        String mode = System.getProperty("production");

        if (mode == null) return false;
        if (!mode.equals("true") && !mode.equals("false")) return false;

        production = Boolean.valueOf(mode);
        return true;
    }

    public static Boolean getProduction() {
        return production;
    }
}
