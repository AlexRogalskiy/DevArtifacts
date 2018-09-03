package kz.luxoft.test;

import java.util.*;

public class WordAvgCalculator
{
    public static List<WordSet> calculateAvg(List<String> words){
        List<WordSet> wordsAvg = new ArrayList<>();

        for(String w : words){
            Set<Character> charsSet = new HashSet<Character>();
            int size = w.length();
            int vowelsCount = 0;
            for(char c : w.toCharArray()){
                if(c=='a' || c=='e' || c=='i' || c=='o' || c=='u') {
                    charsSet.add(c);
                    vowelsCount++;
                }
            }

            WordSet wordSet = new WordSet();
            wordSet.charSet=charsSet;
            wordSet.wordLength=size;
            wordSet.totalVowel=vowelsCount;

            if(wordsAvg.contains(wordSet)){
                for (WordSet wa : wordsAvg)
                    if(wa.equals(wordSet)) {
                        wa.count++;
                        wa.totalVowel+=vowelsCount;
                        break;
                    }
            }else{
                wordsAvg.add(wordSet);
            }
        }
        Collections.sort(wordsAvg);
        return wordsAvg;
    }
}
