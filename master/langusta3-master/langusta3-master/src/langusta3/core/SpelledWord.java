package langusta3.core;

import java.util.ArrayList;

/** Spelled word is container class (syntax sugar)
 *
 * @author marx
 */
public class SpelledWord extends ArrayList<Vowel> {
    public SpelledWord() {
        super();
    }

    public SpelledWord(SpelledWord x) {
        super(x);
    }

    @Override
    public String toString() {
       String result = new String();

       for (Vowel v : this) {
            result += v.toString();
       }

       return result;
    }

    public String getStringAsList() {
        String res = "[ ";
        boolean remove = false;
        for (Vowel v : this) {
            res += v.toString() + ",";
            remove = true;
        }
        if (remove) {
            res = res.substring(0, res.length() - 1);
        }
        res += " ]";

        return res;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final SpelledWord other = (SpelledWord) obj;

        if (other.size() != this.size()) {
            return false;
        }

        for (int i = 0; i < this.size(); i++) {
            if (this.get(i).toString().equals(other.get(i).toString()) == false) {
                return false;
            }
        }

        return true;
    }
}
