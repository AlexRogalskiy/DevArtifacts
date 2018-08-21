package langusta3.pattern.condition;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.SpelledWord;

/**
 *
 * @author marx
 */
public class GrammarClass extends AbstractCondition {
    public GrammarClass(String name) {
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

        for (String charClass : info.getValue().split(",")) {
            if (word.get(Equal.getValidCharNo(word, info)).isInGrammarClass(charClass)) {
                return true;
            }
        }

        return false;
    }

    @Override
    public List<SpelledWord> revert(SpelledWord word, ConditionInfo info) {
        /** @todo: need something better? - all characters from class ?? **/
        List<SpelledWord> lsw = new ArrayList<SpelledWord>();

        if (this.isValid(word, info)) {
            lsw.add(new SpelledWord(word));
        }

        return lsw;
    }
}
