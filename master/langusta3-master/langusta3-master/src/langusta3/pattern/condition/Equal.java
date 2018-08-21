package langusta3.pattern.condition;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.SpelledWord;
import langusta3.core.Vowel;

/**
 *
 * @author marx
 */
public class Equal extends AbstractCondition {
    public Equal(String name) {
        super(name);
    }

    @Override
    public boolean isValid(SpelledWord word, ConditionInfo info) {
        if (this.isApplicable(info) == false) {
            return false;
        }

        if (Equal.getValidCharNo(word, info) == null) {
            return false;
        }

        for (String ch : info.getValue().split(",")) {
            if (ch.equalsIgnoreCase(word.get(Equal.getValidCharNo(word, info)).toString())) {
                return true;
            }
        }

        return false;
    }

    @Override
    public List<SpelledWord> revert(SpelledWord word, ConditionInfo info) {
        List<SpelledWord> result = new ArrayList<SpelledWord>();
        
        if (this.isApplicable(info) == false) {
            return null;
        }

        if (Equal.getValidCharNo(word, info) == null) {
            return null;
        }

        for (String ch : info.getValue().split(",")) {
            int no = Equal.getValidCharNo(word, info);

            if (word.get(no).toString().equals("?")) {
                SpelledWord s = new SpelledWord(word);
                s.set(no, new Vowel(word.get(0).getAlphabet(), ch));
                result.add(s);
            } else if (word.get(no).toString().equals(ch)) {
                SpelledWord s = new SpelledWord(word);
                result.add(s);
            }
        }

        return result;
    }
}
