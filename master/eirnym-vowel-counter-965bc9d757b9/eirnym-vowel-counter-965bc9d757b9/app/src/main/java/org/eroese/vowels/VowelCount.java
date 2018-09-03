package org.eroese.vowels;

import java.util.Objects;
import java.util.Set;

/**
 * Pair of vowels and count of.
 *
 * @author eirnym
 */
public class VowelCount {
    private final Vowels vowels;
    private final int vowelCount;

    public VowelCount(Vowels vowels, int vowelCount) {
        this.vowels = vowels;
        this.vowelCount = vowelCount;
    }

    public VowelCount(Set<Character> vowels, int wordLength, int count) {
        this(new Vowels(wordLength, vowels), count);
    }
    
    public Vowels getVowels() {
        return vowels;
    }

    public int getVowelCount() {
        return vowelCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VowelCount that = (VowelCount) o;
        return vowelCount == that.vowelCount &&
                Objects.equals(vowels, that.vowels);
    }

    @Override
    public int hashCode() {
        return Objects.hash(vowels, vowelCount);
    }

    @Override
    public String toString() {
        return "VowelCount{" +
                "vowels=" + vowels +
                ", vowelCount=" + vowelCount +
                '}';
    }
}
