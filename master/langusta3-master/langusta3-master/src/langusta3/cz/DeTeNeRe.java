package langusta3.cz;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.SpelledWord;
import langusta3.core.Vowel;
import langusta3.pattern.AbstractFilter;
import langusta3.pattern.FormInfo;

/**
 *
 * @author marx
 */
public class DeTeNeRe extends AbstractFilter {

    public DeTeNeRe(String name) {
        super(name);
    }

    /**
     * 
     * @param word
     * @param suffix - ignored 
     * @return
     */
    @Override
    public SpelledWord apply(SpelledWord word, SpelledWord suffix) {
        SpelledWord result = new SpelledWord();

        Vowel prev = null;
        boolean added = false;
        
        for (Vowel v : word) {
            if (prev != null) {
                if (prev.toString().equalsIgnoreCase("ď") && (v.toString().startsWith("e") || v.toString().startsWith("ě"))) {
                    result.add(new Vowel(prev.getAlphabet(), "d"));
                    result.add(new Vowel(prev.getAlphabet(), "ě"));
                    added = true;
                } else if (prev.toString().equalsIgnoreCase("ť") && (v.toString().startsWith("e") || v.toString().startsWith("ě"))) {
                    result.add(new Vowel(prev.getAlphabet(), "t"));
                    result.add(new Vowel(prev.getAlphabet(), "ě"));
                    added = true;
                } else if (prev.toString().equalsIgnoreCase("ň") && (v.toString().startsWith("e") || v.toString().startsWith("ě"))) {
                    result.add(new Vowel(prev.getAlphabet(), "n"));
                    result.add(new Vowel(prev.getAlphabet(), "ě"));
                    added = true;
                } else if (prev.toString().equalsIgnoreCase("ř") && (v.toString().startsWith("ě"))) {
                    result.add(new Vowel(prev.getAlphabet(), "ř"));
                    result.add(new Vowel(prev.getAlphabet(), "e"));
                    added = true;
                } else if (prev.toString().equalsIgnoreCase("ď") && (v.toString().startsWith("i") || v.toString().equalsIgnoreCase("í"))) {
                    result.add(new Vowel(prev.getAlphabet(), "d"));
                } else if (prev.toString().equalsIgnoreCase("ť") && (v.toString().startsWith("i") || v.toString().equalsIgnoreCase("í"))) {
                    result.add(new Vowel(prev.getAlphabet(), "t"));
                } else if (prev.toString().equalsIgnoreCase("ň") && (v.toString().startsWith("i") || v.toString().equalsIgnoreCase("í"))) {
                    result.add(new Vowel(prev.getAlphabet(), "n"));
                } else {
                    if (added == false) {
                        result.add(prev);
                    }
                    added = false;
                }
            }

            prev = v;
            
        }

        if ((prev != null) && (added == false)) {
            result.add(prev);
        }

        return result;
    }

    /**
     * @todo:
     * 
     * @param word
     * @param fi - ignored as this is global filter
     * @return
     */
    public List<SpelledWord> revert(SpelledWord word, FormInfo fi) {
        List<SpelledWord> result = new ArrayList<SpelledWord>();

        if (word == null) {
            return null;
        }

        if (word.size() < 2) {
            result.add(new SpelledWord(word));
            return result;
        }

        String firstV = word.get(0).toString();
        String nextV = word.get(1).toString();

        List<Vowel> changes = new ArrayList<Vowel>();
        changes.add(word.get(0));

        if (firstV.equalsIgnoreCase("ď") && (nextV.startsWith("i") || nextV.equalsIgnoreCase("í") || nextV.toString().equalsIgnoreCase("e") || nextV.equalsIgnoreCase("é"))) {
            changes.add(new Vowel(changes.get(0).getAlphabet(), "ď"));
        } else if (firstV.equalsIgnoreCase("t") && (nextV.startsWith("i") || nextV.equalsIgnoreCase("í") || nextV.toString().equalsIgnoreCase("e") || nextV.equalsIgnoreCase("é"))) {
            changes.add(new Vowel(changes.get(0).getAlphabet(), "ť"));
        } else if (firstV.equalsIgnoreCase("n") && (nextV.startsWith("i") || nextV.equalsIgnoreCase("í") || nextV.toString().equalsIgnoreCase("e") || nextV.equalsIgnoreCase("é"))) {
            changes.add(new Vowel(changes.get(0).getAlphabet(), "ň"));
        } else if (firstV.equalsIgnoreCase("l") && (nextV.startsWith("i") || nextV.equalsIgnoreCase("í") || nextV.toString().equalsIgnoreCase("e") || nextV.equalsIgnoreCase("é"))) {
            changes.add(new Vowel(changes.get(0).getAlphabet(), "ľ"));
        }

        for (Vowel v : changes) {
            SpelledWord res = new SpelledWord(word);
            res.remove(0);
            for (SpelledWord s : this.revert(res, null)) {
                SpelledWord sw = new SpelledWord();

                sw.add(v);
                sw.addAll(s);
                result.add(sw);
            }

        }

        return result;
    }
}
