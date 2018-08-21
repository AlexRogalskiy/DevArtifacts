package langusta3.sk;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.SpelledWord;
import langusta3.pattern.condition.AbstractCondition;
import langusta3.pattern.condition.ConditionInfo;
import langusta3.pattern.condition.Equal;

/** Syllable is used to check if syllable is long/short
 *
 *  This is language dependant and it is possible that even in languages
 *  where this system works, we do not need it :)
 *
 *  @author marx
 */
public class Syllable extends AbstractCondition {

    public Syllable(String name) {
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

        if (info.getValue() == null) {
            return false;
        } else if (info.getValue().equalsIgnoreCase("kratka")) {
            for (int i = Equal.getValidCharNo(word, info); i >= 0; i--) {
                if (word.get(i).isInGrammarClass("dlhá hláska")) {
                    return false;
                } else if (word.get(i).isInGrammarClass("samohláska")) {
                    return true;
                } else if (word.get(i).isInGrammarClass("slabikotvorná") &&
                        ((i - 1 < 0) || (word.get(i - 1).isInGrammarClass("spoluhláska"))) &&
                        ((i + 1 < word.size()) && (word.get(i + 1).isInGrammarClass("spoluhláska")))) {
                    if (word.get(i).isInGrammarClass("dlhá hláska")) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return true;
        } else if (info.getValue().equalsIgnoreCase("dlha")) {
            for (int i = Equal.getValidCharNo(word, info); i >= 0; i--) {
                if ((word.get(i).isInGrammarClass("samohláska")) && (word.get(i).isInGrammarClass("dlhá hláska"))) {
                    return true;
                } else if (word.get(i).isInGrammarClass("samohláska")) {
                    return false;
                } else if (word.get(i).isInGrammarClass("slabikotvorná") &&
                        ((i - 1 < 0) || (word.get(i - 1).isInGrammarClass("spoluhláska"))) &&
                        ((i + 1 < word.size()) && (word.get(i + 1).isInGrammarClass("spoluhláska")))) {
                    if (word.get(i).isInGrammarClass("dlhá hláska")) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            return false;
        } else {
            return false;
        }
    }

    @Override
    public List<SpelledWord> revert(SpelledWord word, ConditionInfo info) {
        List<SpelledWord> lsw = new ArrayList<SpelledWord>();

        if (this.isValid(word, info)) {
            lsw.add(new SpelledWord(word));
        }

        return lsw;
    }
}
