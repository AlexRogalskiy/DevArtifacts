package kz.luxoft.test;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class FileOperations {

    public static List<String> readWords(String filePath) {
        List<String> wordList = new ArrayList<String>();

        try (
                FileReader fr = new FileReader(filePath);
                BufferedReader br = new BufferedReader(fr)
        ){

            String line = br.readLine();
            while (line != null) {
                String[] parts = line.split("[^a-zA-Z0-9\\-\']");
                for (String w : parts) {
                    if(w.matches("^[a-zA-Z0-9\\-']{1,}$")) {
                        wordList.add(w.toLowerCase());
                    }
                }
                line = br.readLine();
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return wordList;
    }

    public static void writeToFile(List<WordSet> wordsAvg){
        try(PrintWriter writer = new PrintWriter("output.txt", "UTF-8")) {
            for(WordSet wa : wordsAvg){
                writer.println(wa);
            }
        } catch (FileNotFoundException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}
