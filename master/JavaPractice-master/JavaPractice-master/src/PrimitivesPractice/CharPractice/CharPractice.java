package PrimitivesPractice.CharPractice;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Sep. 29, 2015
 * <p/>
 * * instagram.com/NoRest4AWhearry
 * <p/>
 * * Project: JavaPractice
 ************************************************************/
public class CharPractice {

    public static void main(String[] args) {
        // Initialize a Char and print to screen
        char a = 'A';
        System.out.println(a);

        // cast char
        byte b = ((byte) a);
        short c = ((short) a);
        int d = ((int) a);
        long e = ((long) a);
        float f = ((float) a);
        double g = ((double) a);
        String h = Character.toString(a);
        System.out.println("The value of char a is: " + a);
        System.out.println("char to byte is: " + b);
        System.out.println("char to short is: " + c);
        System.out.println("char to int is: " + d);
        System.out.println("char to long is: " + e);
        System.out.println("char to float is: " + f);
        System.out.println("char to double is: " + g);
        System.out.println("char to string is: " + h);

        // what is char?
        char i = 'B';
        char j = 'b';
        char k = '1';
        char l = '/';
        System.out.println("Char i is a letter? " + Character.isLetter(i));
        System.out.println("Char i is lowercase? " + Character.isLowerCase(i));
        System.out.println("Char j is lowercase? " + Character.isLowerCase(j));
        System.out.println("Char i is uppercase? " + Character.isUpperCase(i));
        System.out.println("Char j is uppercase? " + Character.isUpperCase(j));
        System.out.println("Char i is digit? " + Character.isDigit(i));
        System.out.println("Char k is digit? " + Character.isDigit(k));
        System.out.println("Char i is Alphabetic? " + Character.isAlphabetic(i));
        System.out.println("Char k is Alphabetic? " + Character.isAlphabetic(k));
        System.out.println("Char l is Alphabetic? " + Character.isAlphabetic(l));
        System.out.println("Char i ('B') lowercase is " + Character.toLowerCase(i));
        System.out.println("Char j ('b') uppercase is " + Character.toUpperCase(j));


        for (char x = 32; x <= 127; x++) {
            System.out.printf("Character %c is an alphabetic letter? %s\n", x, Character.isAlphabetic(x));
        }


    }

}
