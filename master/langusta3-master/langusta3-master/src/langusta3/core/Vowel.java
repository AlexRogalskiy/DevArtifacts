package langusta3.core;

import java.util.HashSet;
import java.util.Set;

/** Vowel defines a sequence of characters
 *
 *  Vowel is defined by a sequence of characters, so then we can define
 *  'ch', 'ia', ... Vowels can be divided into several (non-strictly)
 *  grammatical categories (as defined in alphabet)
 *
 *  @author marx
 */
public class Vowel {
    private Alphabet alphabet;
    private String vowel;
    private Set<GrammarClass> grammar;

    public Vowel(Alphabet alphabet, String vowelString) {
        this.alphabet = alphabet;
        this.vowel = vowelString;
        this.grammar = new HashSet<GrammarClass>();
    }

    @Override
    public String toString() {
        return vowel;
    }

    public void setVowelString(String vowelString) {
        this.vowel = vowelString;
    }

    public void setAlphabet(Alphabet alphabet) {
        this.alphabet = alphabet;
    }
    
    public Alphabet getAlphabet() {
        return alphabet;
    }

    /** Check if vowel is part of the alphabet
     *
     * @return true - if vowel is part of the alphabet
     * @return falses - if vowel is not part of the alphabet
     * @throws NullPointerException - if alphabet is not defined
     */
    public boolean isInAlphabet() {
        return this.alphabet.contains(this.toString());
    }

    /** Check if vowel belongs to particular grammatical class
     *
     *  This check is performed against vowel itself
     *
     *  @return true - if vowel belongs to grammar class
     *  @return false - if vowel does not belong to grammar class
     */
    public boolean isInGrammarClass(String grammarClassName) {
         return grammar.contains(new GrammarClass(grammarClassName));
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 79 * hash + (this.alphabet != null ? this.alphabet.hashCode() : 0);
        hash = 79 * hash + (this.vowel != null ? this.vowel.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        final Vowel other = (Vowel) obj;
        if (getClass() == obj.getClass()) {
            if (this.alphabet != other.alphabet && (this.alphabet == null || !this.alphabet.equals(other.alphabet))) {
                return false;
            }
            if ((this.vowel == null) ? (other.vowel != null) : !this.vowel.equals(other.vowel)) {
                return false;
            }
            return true;
        }

        return false;
    }

    Set<GrammarClass> getGrammarClasses() {
        return grammar;
    }

    public boolean addGrammarClass(GrammarClass grammarClassName) {
        return grammar.add(grammarClassName);
    }
}
