package org.fkunnen.hello;

import java.util.Arrays;
import java.util.stream.Collectors;

public class Hello {

    public static void main(String[] args){
        String joinedArgs = Arrays.stream(args).collect(Collectors.joining(" "));

        if (joinedArgs != null && joinedArgs.length() > 0) {
            System.out.println("Hello " + joinedArgs);
        }
        else {
            System.out.println("Hello world");
        }
    }

}
