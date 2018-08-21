package langusta3.pattern.rule;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.Alphabet;
import langusta3.core.SpelledWord;
import langusta3.core.Vowel;
import langusta3.pattern.condition.ConditionInfo;

/**
 *
 * @author marx
 */
public class Chop extends AbstractRule {
    public Chop(String name) {
        super(name);
    }

    @Override
    public SpelledWord apply(Alphabet alphabet, SpelledWord word, ConditionInfo info) throws RuleNotApplicableException {
        Integer ch = info.getCharNo();


        if (word.size() == 0) {
            throw new RuleNotApplicableException("Unable to remove character from empty word");
        }

        if ((ch != null) && (ch < 0)) {
            ch = word.size() + ch;
        }

        if (ch == null) {
            ch = word.size() - 1;
        }
        word.remove((int) ch);

        return word;
    }

    @Override
    public List<SpelledWord> revert(SpelledWord word, ConditionInfo info) {
        List<SpelledWord> result = new ArrayList<SpelledWord>();

        if (this.isApplicable(info) == false) {
            return null;
        }

        /** @todo: value is ignored; chop works with last character **/
        SpelledWord w = new SpelledWord(word);
        w.add(new Vowel(word.get(0).getAlphabet(), "?"));
        result.add(w);

        return result;
    }
}
