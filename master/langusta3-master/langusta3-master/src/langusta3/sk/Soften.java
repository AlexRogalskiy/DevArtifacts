package langusta3.sk;

import java.util.List;
import langusta3.core.Alphabet;
import langusta3.core.SpelledWord;
import langusta3.core.Vowel;
import langusta3.pattern.condition.ConditionInfo;
import langusta3.pattern.rule.AbstractRule;

/**
 *
 * @author marx
 */
public class Soften extends AbstractRule {
    public Soften(String name) {
        super(name);
    }

    @Override
    public SpelledWord apply(Alphabet alphabet, SpelledWord word, ConditionInfo info) {
        int ch;
        ConditionInfo ci;
        
        if (info.getCharNo() != null) {
            ch = info.getCharNo();
        } else {
            ch = -1;
        }

        ci = new ConditionInfo(null, null, ch, null);
        ch = Soften.getValidCharNo(word, ci);

        /** @note: word is changed directly - return code is ignored **/
        /** @todo: add more vowels that can be softened in Slovak **/
        if (word.get(ch).toString().equalsIgnoreCase("d")) {
            word.set(ch, new Vowel(word.get(ch).getAlphabet(), "ď"));
        } 
        
        return word;
    }

    @Override
    public List<SpelledWord> revert(SpelledWord word, ConditionInfo info) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
