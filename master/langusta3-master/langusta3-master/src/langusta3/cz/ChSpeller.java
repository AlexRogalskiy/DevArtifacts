package langusta3.cz;

import java.util.ArrayList;
import java.util.List;
import langusta3.core.Alphabet;
import langusta3.core.SpelledWord;
import langusta3.spelling.NaiveSpeller;

/** Slightly better speller for Slovak language
 *
 *  This speller uses Naive to obtain all possible spelling for given word.
 *  Then it removes those spelling which splits vowels ch into two
 *  vowels. We believes that there is just a limited set of exception which
 *  can be handled directly.
 *
 *  @todo handle exception (viac-hlas)
 *  @author marx
 */
public class ChSpeller extends NaiveSpeller {

    public ChSpeller(Alphabet alphabet) {
        super(alphabet);
    }

    @Override
    public List<SpelledWord> wordSpelling(String word) {
        List<SpelledWord> superResult = super.wordSpelling(word);
        List<SpelledWord> result = new ArrayList<SpelledWord>();

        /** @todo: handle exceptions here **/

        // remove spelling which do not fit into our constraints
        for (SpelledWord s : superResult) {
            boolean accept = true;

            for (int i = 0; i + 1 < s.size(); i++) {
                if (s.get(i).toString().equals("c") && s.get(i + 1).toString().equals("h")) {
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
