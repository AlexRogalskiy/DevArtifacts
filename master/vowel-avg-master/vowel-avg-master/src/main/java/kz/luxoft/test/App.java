package kz.luxoft.test;

import java.io.*;
import java.util.*;

public class App
{
    public static void main( String[] args )
    {
        System.out.println("Path to input file : ");
        String s = "";
        Scanner scanIn = new Scanner(System.in);
        s = scanIn.nextLine();
        scanIn.close();

        if(s.equals("")) {
            System.out.println("Empty file path");
            return;
        }

        List<String> words = FileOperations.readWords(s);
        List<WordSet> wordsAvg = WordAvgCalculator.calculateAvg(words);
        FileOperations.writeToFile(wordsAvg);
    }
}
