package langusta3.core;

import java.util.List;
import java.util.ArrayList;

/** Alphabet defines vowels
 *
 *  This project attempts to work with vowels instead of characters,
 *  so we need to declare acceptable characters and their grammatical
 *  classes.
 *
 * @author marx
 */
public class Alphabet {
    private List<Vowel> vowels;

    public Alphabet() {
        this.vowels = new ArrayList<Vowel>();
    }

    public boolean contains(String vowel) {
        Vowel v = new Vowel(this, vowel);
        return vowels.contains(v);
    }

    public Vowel getVowel(String vowel) {
        for (Vowel v : vowels) {
            if (v.toString().equals(vowel)) {
                return v;
            }
        }

        return null;
    }

    /** Add vowel to the alphabet
     *
     *  Vowel is added to the alphabet if it is not already there.
     *  If this suceed then we will set vowel's alphabet to our value.
     *
     *  @param v - vowel to add to alphabet
     */
    public boolean addVowel(Vowel v) {
        for (Vowel x : vowels) {
            if (x.toString().equals(v.toString())) {
                return false;
            }
        }

        vowels.add(v);
        v.setAlphabet(this);
        return true;
    }
}
