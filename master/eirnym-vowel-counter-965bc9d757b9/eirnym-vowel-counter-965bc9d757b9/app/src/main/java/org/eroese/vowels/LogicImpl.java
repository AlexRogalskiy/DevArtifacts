package org.eroese.vowels;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * @author eirnym
 */
public class LogicImpl implements Logic {

    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("0.#");
    private static final String ENCODING = "UTF-8";

    @Override
    public Map<Vowels, Double> readCounts(String filename) throws IOException {
        final Counter counter = new Counter();

        try (BufferedReader reader = getInputReader(filename)) {
            Iterable<String> wordIterable = new WordReaderIterable(reader);

            wordIterable.forEach(s -> {
                VowelCount vowelCount = count(s);
                if (vowelCount != null) {
                    counter.add(vowelCount.getVowels(), vowelCount.getVowelCount());
                }
            });

        }

        return counter.getAverage();
    }

    @Override
    public void writeCounts(Map<Vowels, Double> results, final String filename) throws IOException {
        try (OutputStream stream = getOutputStream(filename)) {
            for (Map.Entry<Vowels, Double> entry : results.entrySet()) {
                final Vowels key = entry.getKey();

                final double average = entry.getValue();
                final Set<Character> vowels = key.getVowels();
                final int length = key.getWordLength();

                final String number = DECIMAL_FORMAT.format(average); // properly format number
                final String line = String.format(OUTPUT_FORMAT, vowels, length, number);

                // We should output curve brackets instead of square ones and write bytes
                stream.write(line.replaceAll("\\[", "{").replaceAll("\\]", "}").getBytes(ENCODING));
            }
        }
    }

    @Override
    public VowelCount count(String word) {
        if (word == null || word.isEmpty()) { // we don't want count for empty words
            return null;
        }

        final Set<Character> vowels = new HashSet<>(); // vowels we met
        final int wordLength = word.length(); // word length
        int count = 0; // total vowel count

        for (int idx = 0; idx < wordLength; idx += 1) {
            final char c = word.charAt(idx);
            if (       c == 'a'                // there are only 8 vowels (include uppercase variants)
                    || c == 'e'
                    || c == 'o'
                    || c == 'u'
                    || c == 'A'
                    || c == 'E'
                    || c == 'O'
                    || c == 'U') {
                vowels.add(Character.toLowerCase(c));
                count += 1;
            }
        }

        return new VowelCount(vowels, wordLength, count);
    }

    public BufferedReader getInputReader(String filename) throws IOException {
        if ("-".equals(filename)) {
            return new BufferedReader(new InputStreamReader(System.in));
        }

        return Files.newBufferedReader(Paths.get(filename));
    }

    public OutputStream getOutputStream(String filename) throws IOException {
        if ("-".equals(filename)) {
            return System.out;
        }

        return Files.newOutputStream(Paths.get(filename));
    }
}
