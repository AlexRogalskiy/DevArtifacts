package langusta3.pattern.condition;

import java.util.List;
import langusta3.core.SpelledWord;

/** Common part of all defined condition types
 *
 *  This class is used as a base for all condition type
 *
 *  @author marx
 */
public abstract class AbstractCondition {
    private String name;

    public AbstractCondition(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public abstract boolean isValid(SpelledWord word, ConditionInfo info);
    public abstract List<SpelledWord> revert(SpelledWord word, ConditionInfo info);

    public boolean isApplicable(ConditionInfo info) {
        if (this.name.equals(info.getType())) {
            return true;
        } else {
            return false;
        }
    }

    public static Integer getValidCharNo(SpelledWord word, ConditionInfo info) {
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
