package org.eroese.vowels;

import java.util.*;

/**
 * Pair of word length and set of vowels
 *
 * @author eirnym
 */
public class Vowels {
    /**
     * Word length
     */
    private final int wordLength;

    /**
     * Vowels involved
     */
    private final Set<Character> vowels;

    public Vowels(int wordLength, Collection<Character> vowels) {
        this.wordLength = wordLength;
        this.vowels = new HashSet<>(vowels);
    }

    public int getWordLength() {
        return wordLength;
    }

    public Set<Character> getVowels() {
        return Collections.unmodifiableSet(vowels);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vowels vowels1 = (Vowels) o;
        return wordLength == vowels1.wordLength &&
                Objects.equals(vowels, vowels1.vowels);
    }

    @Override
    public int hashCode() {
        return Objects.hash(wordLength, vowels);
    }

    @Override
    public String toString() {
        return "Vowels{" +
                "wordLength=" + wordLength +
                ", vowels=" + vowels +
                '}';
    }
}
