package langusta3.pattern.rule;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.Alphabet;
import langusta3.core.SpelledWord;
import langusta3.pattern.condition.ConditionInfo;

/**
 *
 * @author marx
 */
public class Append extends AbstractRule {
    public Append(String name) {
        super(name);
    }

    @Override
    public SpelledWord apply(Alphabet alphabet, SpelledWord word, ConditionInfo info) throws RuleNotApplicableException {
        /** @todo support for multi-vowel append **/
        if (info.getCharNo() == null) {
            // check if character is in alphabet
            if (alphabet.getVowel(info.getValue()) == null) {
                throw new RuleNotApplicableException(info.getValue() + "is not part of alphabet");
            }
            word.add(alphabet.getVowel(info.getValue()));
        } else {
            try {
                word.add(Append.getValidCharNo(word, info) + 1, alphabet.getVowel(info.getValue()));
            } catch (java.lang.NullPointerException ex) {
                word.add(0, alphabet.getVowel("Q"));
            }
        }

        return word;
    }

    @Override
    public List<SpelledWord> revert(SpelledWord word, ConditionInfo info) {
        List<SpelledWord> result = new ArrayList<SpelledWord>();
        SpelledWord sword = new SpelledWord(word);
        int ch;

        if (this.isApplicable(info) == false) {
            return null;
        }

        if (Append.getValidCharNo(word, info) == null) {
            ch = word.size() - 1;
        } else {
            if (info.getCharNo() < 0) {
                ch = word.size() + info.getCharNo();
            } else {
                ch = info.getCharNo();
            }
        }

        /** @todo support for multi-vowel append **/

        if (sword.get(ch).toString().equals(info.getValue()) || sword.get(ch).toString().equals("?")) {
            sword.remove(ch);
            result.add(sword);
        } 

        return result;
    }
}
