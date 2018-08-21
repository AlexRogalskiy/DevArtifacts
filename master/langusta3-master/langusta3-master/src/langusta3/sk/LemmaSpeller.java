package langusta3.sk;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.Alphabet;
import langusta3.core.SpelledWord;

/**
 *
 * @author marx
 */
public class LemmaSpeller extends DzChSpeller {
    public LemmaSpeller(Alphabet alphabet) {
        super(alphabet);
    }

    @Override
    public List<SpelledWord> wordSpelling(String word) {
        List<SpelledWord> superResult = super.wordSpelling(word);
        List<SpelledWord> result = new ArrayList<SpelledWord>();

        for (SpelledWord s : superResult) {
            boolean accept = true;

            for (int i = s.size() - 2; i > 0; i--) {
                if (s.get(i).toString().equals("i") && s.get(i + 1).toString().equals("a") && ( i + 2 != s.size())) {
                    accept = false;
                } else if (s.get(i).toString().equals("i") && s.get(i + 1).toString().equals("e") && ( i + 2 != s.size())) {
                    accept = false;
                } else if (s.get(i).toString().equals("i") && s.get(i + 1).toString().equals("u") && ( i + 2 != s.size())) {
                    accept = false;
                }
            }

            if (accept) {
                result.add(s);
            }
        }

        return result;
    }

}
