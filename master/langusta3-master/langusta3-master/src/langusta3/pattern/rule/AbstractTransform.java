/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package langusta3.pattern.rule;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import langusta3.core.Alphabet;
import langusta3.core.SpelledWord;
import langusta3.pattern.condition.ConditionInfo;

/**
 *
 * @author marx
 */
public class AbstractTransform extends AbstractRule {
    protected Map<String, String> transformTable;
    
    public AbstractTransform(String name) {
        super(name);
        
        transformTable = new HashMap<String, String>();
    }
        
    @Override
    public SpelledWord apply(Alphabet alphabet, SpelledWord word, ConditionInfo info) throws RuleNotApplicableException {
        Integer charno = info.getCharNo();
        
        if (info.getCharNo() == null) {
            charno = word.size() - 1;
        }

        if (charno < 0) {
            charno += word.size();
        }
        
        for (String k : transformTable.keySet()) {
            if (word.get(charno).toString().equals(k)) {
                word.remove((int) charno);

                word.add(charno, alphabet.getVowel(transformTable.get(k)));
                break;
            }
        }
        
        return word;
    }

    @Override
    public List<SpelledWord> revert(SpelledWord word, ConditionInfo info) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
