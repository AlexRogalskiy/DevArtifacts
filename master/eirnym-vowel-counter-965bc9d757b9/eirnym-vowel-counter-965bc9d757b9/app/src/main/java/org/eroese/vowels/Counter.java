package org.eroese.vowels;

import java.util.*;

/**
 * Accumulator for vowels and vowel counts in words. It used to calculate average.
 *
 * @author eirnym
 */
public class Counter {
    /**
     * Accumulator
     */
    private final Map<Vowels, List<Integer>> counters;

    public Counter() {
        counters = new HashMap<>();
    }

    /**
     * Adds next vowels and their count from new word.
     * @param vowels vowels
     * @param count count
     */
    public void add(Vowels vowels, int count) {
        if (!counters.containsKey(vowels)) {
            counters.put(vowels, new ArrayList<>());
        }

        counters.get(vowels).add(count);
    }

    /**
     * Calculates average count for each key
     */
    public Map<Vowels, Double> getAverage() {
        final Map<Vowels, Double> result = new HashMap<>(counters.size());

        for (Map.Entry<Vowels, List<Integer>> entry : counters.entrySet()) {
            result.put(entry.getKey(), average(entry.getValue()));
        }

        return result;
    }

    /**
     * Calculates average sum for any iterable of numbers
     */
    public static double average(Iterable<? extends Number> values) {
        if (values == null) {
            return 0.0;
        }

        double sum = 0;
        int count = 0;
        for (Number number : values) {
            sum += number.doubleValue();
            count += 1;
        }

        if (count > 0) {
            return sum / count;
        } else {
            return 0.0;
        }
    }
}
