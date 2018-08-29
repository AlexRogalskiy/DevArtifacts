package com.example.captchaserver;

import java.util.Random;

public class TextGenerator {
    private static Random rand     = new Random();
    private static String asciiAlphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static String numAlphabet = "1234567890";

    private static String generateString(String alphabet, int len) {
        String generatedString = "";
        for (int i = 0; i < len; i++) {
            generatedString += alphabet.charAt(rand.nextInt(alphabet.length()));
        }
        return generatedString;
    }

    public static String generateText(int len) {
        return generateString(asciiAlphabet, len);
    }

    public static String generateId() {
        return generateString(numAlphabet, 6);
    }
}
