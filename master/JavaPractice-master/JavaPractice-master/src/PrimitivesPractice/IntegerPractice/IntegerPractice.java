package PrimitivesPractice.IntegerPractice;

import static java.lang.Integer.*;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Sep. 29, 2015
 * <p/>
 * * instagram.com/NoRest4AWhearry
 * <p/>
 * * Project: JavaPractice
 ************************************************************/
public class IntegerPractice {
    public static void main(String[] args) {
        // initialize & print to screen int
        int a = 90;
        System.out.println(a);


        // Cast int to other data types
        byte b = ((byte) a);
        short c = ((short) a);
        char d = ((char) a);
        long e = ((long) a);
        float f = ((float) a);
        double g = ((double) a);
        String h = Integer.toString(a);
        System.out.println("The value of int a is: " + a);
        System.out.println("int to byte is: " + b);
        System.out.println("int to short is: " + c);
        System.out.println("int to char is: " + d);
        System.out.println("int to long is: " + e);
        System.out.println("int to float is: " + f);
        System.out.println("int to double is: " + g);
        System.out.println("int to string is: " + h);

        System.out.println("Int a to in binary is: " + Integer.toBinaryString(a));
        System.out.println("Int a to in Hexadecimal is: " + Integer.toHexString(a));
        System.out.println("Int a to in Octal is: " + Integer.toOctalString(a));
        System.out.println(Integer.signum(-44)); // returns -1 if number is negative
        System.out.println(Integer.signum(33)); // returns 1 if number is positive
        System.out.println(Integer.signum(0)); // returns 0 if number is 0

        int z = 4;

        // add static library Integer to use just signum() vs Integer.signum()
        if (signum(z) == -1) System.out.println("int z is less than zero");
        else if (signum(z) == 1) System.out.println("int z is Greater than zero");
        else System.out.println("tnt z is zero");

        System.out.println("The greater number between 3 & 6 is: " + max(3, 6));
        System.out.println("The smaller number between 3 & 6 is: " + min(3, 6));
        System.out.println("The sum of 4 & 5 is: " + sum(4, 5));


    }
}
