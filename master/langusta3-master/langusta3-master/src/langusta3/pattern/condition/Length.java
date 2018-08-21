package langusta3.pattern.condition;

import java.util.List;
import langusta3.core.SpelledWord;

/**
 *
 * @author marx
 */
public class Length  extends AbstractCondition {
     public Length(String name) {
        super(name);
    }

    @Override
    public boolean isValid(SpelledWord word, ConditionInfo info) {
        if (this.isApplicable(info) == false) {
            return false;
        }

        for (String charClass : info.getValue().split(",")) {
            int expectedLength = Integer.parseInt(charClass);
            if (expectedLength == word.size()) {
                return true;
            }
        }
        return false;
    }

    @Override
    public List<SpelledWord> revert(SpelledWord word, ConditionInfo info) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
   
}
