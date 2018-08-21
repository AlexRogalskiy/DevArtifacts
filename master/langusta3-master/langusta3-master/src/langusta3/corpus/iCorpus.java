package langusta3.corpus;

public interface iCorpus {
    boolean contains(String token);

    /** Return frequency of the token.
     *
     *  This method returns frequency (relative or absolute) of the given token
     *  in the corpora. 
     **/
    String getTokenFrequency(String token);
}
