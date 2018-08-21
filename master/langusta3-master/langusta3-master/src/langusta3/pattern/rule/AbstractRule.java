package langusta3.pattern.rule;

import java.util.List;
import langusta3.core.Alphabet;
import langusta3.core.SpelledWord;
import langusta3.pattern.condition.ConditionInfo;

/** Common part of all defined operations for base changes
 *
 * @author marx
 * @todo nájdi spoločnú nadtriedu s AbstractCondition
 */
public abstract class AbstractRule {
    private String name;

    public AbstractRule(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public abstract SpelledWord apply(Alphabet alphabet, SpelledWord word, ConditionInfo info) throws RuleNotApplicableException;
    public abstract List<SpelledWord> revert(SpelledWord word, ConditionInfo info);

    public boolean isApplicable(ConditionInfo info) {
        if (this.name.equals(info.getType())) {
            return true;
        } else {
            return false;
        }
    }

    public static Integer getValidCharNo(SpelledWord word, ConditionInfo info) {
        if (info.getCharNo() == null) {
            return null;
        }
        
        if (info.getCharNo() < 0) {
            Integer x = new Integer(info.getCharNo() + word.size());
            if (x < 0) {
                return null;
            } else {
                return x;
            }
        } else {
            return new Integer(info.getCharNo());
        }
    }

    @Override
    public String toString() {
        return name;
    }
}
