package kz.luxoft.test;

import java.text.DecimalFormat;
import java.util.Iterator;
import java.util.Objects;
import java.util.Set;

public class WordSet implements Comparable<WordSet> {
    public Set<Character> charSet;
    public int wordLength;
    public int totalVowel;
    public int count = 1;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WordSet wordSet = (WordSet) o;
        return Objects.equals(wordLength, wordSet.wordLength) &&
                Objects.equals(charSet, wordSet.charSet);
    }

    @Override
    public int hashCode() {
        return Objects.hash(charSet, wordLength);
    }

    @Override
    public String toString(){
        StringBuilder sb = new StringBuilder();
        sb.append("(");

        Iterator<Character> iterator = charSet.iterator();
        if (! iterator.hasNext())
            sb.append("{}");
        else {
            sb.append("{");
            for (; ; ) {
                sb.append(iterator.next());
                if (!iterator.hasNext()){
                    sb.append('}').toString();
                    break;
                }
                sb.append(',').append(' ');
            }
        }

        DecimalFormat formatter = new DecimalFormat("#.##");
        sb.append(", "+wordLength+") -> "+formatter.format(((double)totalVowel)/count));

        return sb.toString();
    }


    @Override
    public int compareTo(WordSet ws)
    {
        if(ws.charSet.size()-this.charSet.size() == 0){
            return ws.wordLength-this.wordLength;
        }else return ws.charSet.size()-this.charSet.size();
    }
}
