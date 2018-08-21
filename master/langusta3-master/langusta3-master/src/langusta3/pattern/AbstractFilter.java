package langusta3.pattern;

import java.util.List;
import langusta3.core.SpelledWord;

/**
 *
 * @author marx
 */
public abstract class AbstractFilter {
    private String name;

    public AbstractFilter(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public abstract SpelledWord apply(SpelledWord word, SpelledWord suffix);

    public boolean isApplicable(FormInfo info) {
        if (this.name.equals(info.getFilter())) {
            return true;
        } else {
            return false;
        }
    }

    public abstract List<SpelledWord> revert(SpelledWord word, FormInfo fi);

    @Override
    public String toString() {
        return name;
    }
}
