package kz.luxoft.test;


import org.junit.Assert;
import org.junit.Test;

import java.util.*;

public class AppTest
{
    @Test
    public void test1(){
        List<String> words = FileOperations.readWords(getClass().getClassLoader().getResource("test-resources/input1.txt").getPath());
        List<WordSet> wordsAvg = WordAvgCalculator.calculateAvg(words);

        WordSet ws1 = new WordSet();
        Set<Character> ch1 = new HashSet<Character>();
        ch1.add('a');
        ch1.add('o');
        ws1.charSet = ch1;
        ws1.count=2;
        ws1.totalVowel=5;
        ws1.wordLength=6;


        WordSet ws2 = new WordSet();
        Set<Character> ch2 = new HashSet<Character>();
        ch2.add('a');
        ch2.add('e');
        ws2.charSet = ch2;
        ws2.count=1;
        ws2.totalVowel=2;
        ws2.wordLength=4;

        WordSet ws3 = new WordSet();
        Set<Character> ch3 = new HashSet<Character>();
        ch3.add('a');
        ch3.add('o');
        ws3.charSet = ch3;
        ws3.count=1;
        ws3.totalVowel=2;
        ws3.wordLength=5;

        Assert.assertTrue(wordsAvg.contains(ws1));
        Assert.assertTrue(wordsAvg.contains(ws2));
        Assert.assertTrue(wordsAvg.contains(ws3));
        Assert.assertEquals(words.size(), 4);
        Assert.assertEquals(wordsAvg.size(), 3);
    }

    @Test
    public void test2(){
        List<String> words = FileOperations.readWords(getClass().getClassLoader().getResource("test-resources/input2.txt").getPath());
        List<WordSet> wordsAvg = WordAvgCalculator.calculateAvg(words);

        WordSet ws1 = new WordSet();
        Set<Character> ch1 = new HashSet<Character>();
        ch1.add('e');
        ws1.charSet = ch1;
        ws1.count=1;
        ws1.totalVowel=1;
        ws1.wordLength=4;

        Assert.assertTrue(wordsAvg.contains(ws1));
        Assert.assertEquals(words.size(), 1);
        Assert.assertEquals(wordsAvg.size(), 1);
    }

    @Test
    public void test3(){
        List<String> words = FileOperations.readWords(getClass().getClassLoader().getResource("test-resources/input3.txt").getPath());
        List<WordSet> wordsAvg = WordAvgCalculator.calculateAvg(words);

        Assert.assertEquals(wordsAvg.get(0).toString(), "({e, o}, 8) -> 3");
        Assert.assertEquals(wordsAvg.get(1).toString(), "({a, e}, 8) -> 3");
        Assert.assertEquals(wordsAvg.get(2).toString(), "({e, i}, 7) -> 2");
        Assert.assertEquals(wordsAvg.get(3).toString(), "({a, e}, 5) -> 2");
        Assert.assertEquals(wordsAvg.get(4).toString(), "({e}, 3) -> 1");
        Assert.assertEquals(wordsAvg.get(5).toString(), "({o}, 2) -> 1");
    }

    @Test
    public void test4(){
        List<String> words = FileOperations.readWords(getClass().getClassLoader().getResource("test-resources/input4.txt").getPath());
        Assert.assertTrue(words.isEmpty());
        List<WordSet> wordsAvg = WordAvgCalculator.calculateAvg(words);
        Assert.assertTrue(wordsAvg.isEmpty());
    }
}
