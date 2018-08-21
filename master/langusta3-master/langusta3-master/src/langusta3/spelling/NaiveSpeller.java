package langusta3.spelling;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.Alphabet;
import langusta3.core.SpelledWord;
import langusta3.core.Vowel;

/** Naive speller for dividing String into SpelledWord
 *
 *  Basic transcription from String -> list of Vowels. It offers
 *  all possibilities based on given alphabet. Derived classes should
 *  remove possibilities that are not correct.
 *
 *  @author marx
 */
public class NaiveSpeller implements iSpeller {
    private Alphabet alphabet;
    private int longestVowelInAlphabet = 3;

    public NaiveSpeller(Alphabet givenAlphabet) {
        alphabet = givenAlphabet;
    }

    /** Get all possible spellings for given word
     * 
     * @param givenWord - word to spell
     * @return list of all possible spellings
     * @throw NullPointerException - if givenWord is null
     */
    public List<SpelledWord> wordSpelling(String givenWord) {
        if (givenWord == null) {
            throw (new NullPointerException());
        }

        return this.recursiveWordSpelling(new SpelledWord(), givenWord);
    }

    protected List<SpelledWord> recursiveWordSpelling(SpelledWord givenSpelling, String givenWord) {
        List<SpelledWord> result = new ArrayList<SpelledWord>();

        if (givenWord.length() == 0) {
            result.add(givenSpelling);
        }

        /** Alghorithm for finding all possible spellings.
         *  Number '3' is set to longest vowel which can consist of XX
         *  characters (e.g. zzs, ch). '3' looks enough for european languages
         *  This algorithm is not very effective but it is simple enough and
         *  words usually consist of just few (~ <100) characters.
         **/
        for (int i=1; i <= this.longestVowelInAlphabet; i++) {
            if (givenWord.length() >= i) {
                if (alphabet.contains(givenWord.substring(0,i)) == true) {
                    SpelledWord x = new SpelledWord(givenSpelling);
                    x.add(alphabet.getVowel(givenWord.substring(0,i)));
                    result.addAll(this.recursiveWordSpelling(x, givenWord.substring(i)));
                }
            }
        }
        return result;
    }
}
