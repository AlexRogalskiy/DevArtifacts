package langusta3.corpus;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 *  @todo: read/return correct frequency for tokens
 **/
public class FrequencyCorpus implements iCorpus {
    List<String> wordlist;
    Map<String, String> freq;
    
    public FrequencyCorpus(String filename) throws FileNotFoundException, IOException {
        String actualLine;
        BufferedReader inx;
        
        wordlist = new ArrayList<String>();
        freq = new HashMap<String, String>();
        
        try {
            inx = new BufferedReader(new InputStreamReader(new FileInputStream(filename), "utf-8"));
        } catch (FileNotFoundException ex) {
            throw (new FileNotFoundException("[norm] : " + filename + " not found"));
        } catch (UnsupportedEncodingException ex) {
            throw (new RuntimeException("[crit] Programmer's fault: Unsupported encoding"));
        }
        
        while ((actualLine = inx.readLine()) != null) {
            if (actualLine.indexOf(" ") != -1) {
                String word = actualLine.substring(0, actualLine.indexOf(" "));
                
                if (word == null) {
                    continue;
                } else {
                    String f = actualLine.substring(actualLine.indexOf(" ") + 1);
                    freq.put(word, f);
                    wordlist.add(word);
                }
            }
        }
        inx.close();
    }
    
    public boolean contains(String token) {
        return freq.containsKey(token);
    }
    
    public String getTokenFrequency(String token) {
        if (freq.containsKey(token) == false) {
            return null;
        } else {
            return freq.get(token);
        }
    }
}
