package langusta3.spelling;

import java.util.List;
import langusta3.core.SpelledWord;

public interface iSpeller {
    public List<SpelledWord> wordSpelling(String givenWord);
}
