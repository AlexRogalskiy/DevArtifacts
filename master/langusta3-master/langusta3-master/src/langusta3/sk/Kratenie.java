package langusta3.sk;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.SpelledWord;
import langusta3.core.Vowel;
import langusta3.pattern.AbstractFilter;
import langusta3.pattern.FormInfo;
import langusta3.pattern.condition.ConditionInfo;

/**
 *
 * @author marx
 */
public class Kratenie extends AbstractFilter {
    public Kratenie (String name) {
        super(name);
    }

    @Override
    public SpelledWord apply(SpelledWord word, SpelledWord suffix) {
        ConditionInfo ci = new ConditionInfo(null, "syllable", -1, "dlha");
        Syllable s = new Syllable("syllable");

        if (s.isValid(word, ci) == false) {
            return new SpelledWord(suffix);
        } else {
            // last syllable in base is long, so we have to shorten suffix
            SpelledWord sw = new SpelledWord(suffix);

            /** @todo: je možné, že tam treba dostať tú abecedu inak **/
            if ((sw.get(0).toString().equalsIgnoreCase("ia")) || (sw.get(0).toString().equalsIgnoreCase("á"))) {
                sw.set(0, new Vowel(suffix.get(0).getAlphabet(), "a"));
            } else if ((sw.get(0).toString().equalsIgnoreCase("ie")) || (sw.get(0).toString().equalsIgnoreCase("é"))) {
                sw.set(0, new Vowel(suffix.get(0).getAlphabet(), "e"));
            } else if ((sw.get(0).toString().equalsIgnoreCase("iu")) || (sw.get(0).toString().equalsIgnoreCase("ú"))) {
                sw.set(0, new Vowel(suffix.get(0).getAlphabet(), "u"));
            } else if (sw.get(0).toString().equalsIgnoreCase("ô")) {
                sw.set(0, new Vowel(suffix.get(0).getAlphabet(), "o"));
            } else if (sw.get(0).toString().equalsIgnoreCase("í")) {
                sw.set(0, new Vowel(suffix.get(0).getAlphabet(), "i"));
            } else if (sw.get(0).toString().equalsIgnoreCase("ý")) {
                sw.set(0, new Vowel(suffix.get(0).getAlphabet(), "y"));
            }

            return sw;
        }
    }

    /**
     *  global filters were reverted before, so no need to take care of them
     * @param word
     * @param fi
     * @return
     */
    @Override
    public List<SpelledWord> revert(SpelledWord word, FormInfo fi) {
        SpelledWord candidateSuffix = new SpelledWord();
        SpelledWord candidateBase = new SpelledWord();
        SpelledWord realSuffix = new SpelledWord();
        List<SpelledWord> result = new ArrayList<SpelledWord>();
        
        if ((fi.getSuffix() == null) || (fi.getSuffix().length() == 0) || (word.size() < fi.getSuffix().split(",").length)) {
            // no suffix -> no change at all
            result.add(new SpelledWord(word));
            return result;
        }

        // split word into base + suffix
        for (Vowel c : word.subList(0, word.size() - fi.getSuffix().split(",").length)) {
            candidateBase.add(c);
        }
        for (Vowel c : word.subList(word.size() - fi.getSuffix().split(",").length, word.size())) {
            candidateSuffix.add(c);
        }
        for (String ch : fi.getSuffix().split(",")) {
            realSuffix.add(new Vowel(word.get(0).getAlphabet(), ch));
        }

        // Join base + suffix
        if (realSuffix.size() == 0) {
            result.add(new SpelledWord(word));
            return result;
        }

        SpelledWord sx = this.apply(candidateBase, realSuffix);

        if (sx.toString().equals(candidateSuffix.toString()) == false) {
            return null;
        }

        SpelledWord s = new SpelledWord(candidateBase);
        for (Vowel v : realSuffix) {
            s.add(v);
        }

        result.add(s);
        return result;
    }
}
