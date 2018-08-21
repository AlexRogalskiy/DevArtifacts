package langusta3.pattern;

import langusta3.core.SpelledWord;

/**
 *
 * @author marx
 */
public class FormInfoTO {
    private SpelledWord lemma;
    private SpelledWord word;
    private String tag;
    private int points;
    private String pattern;

    public FormInfoTO() {
        lemma = null;
        word = null;
        tag = null;
        pattern = null;
        points = 0;
    }

    public void setLemma(SpelledWord l) { lemma = new SpelledWord(l); }
    public void setWord(SpelledWord w) {
        word = new SpelledWord(w);
    }
    public void setTag(String t) {
        if (t == null) {
            tag = null;
        } else {
            tag = new String(t);
        }
    }
    public void setPoints(int p) { points = p; }
    public void setPattern(String p) {
        if (p == null) {
            pattern = null;
        } else {
            pattern = new String(p);
        }
    }

    public SpelledWord getLemma() { return lemma; }
    public SpelledWord getWord() { return word; }
    public String getTag() { return new String(tag); }
    public int getPoints() { return points; }
    public String getPattern() { return new String(pattern); }

    @Override
    public String toString() {
        String result = new String();

        result = this.getLemma() + " # " + this.getWord() + " ## " + tag + " >> " + pattern + "\n";

        return result;
    }
}
