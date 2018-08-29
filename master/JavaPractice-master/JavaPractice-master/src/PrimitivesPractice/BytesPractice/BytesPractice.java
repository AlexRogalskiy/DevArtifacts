package PrimitivesPractice.BytesPractice;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Sep. 29, 2015
 *
 * * instagram.com/NoRest4AWhearry
 *
 * * Project: JavaPractice
 ************************************************************/
public class BytesPractice {
    public static void main(String[] args) {

        // Byte min & max values
        byte min = Byte.MIN_VALUE; // -128
        byte max = Byte.MAX_VALUE; // 127
        // print to screen its values
        System.out.println("Byte Min Value is: " + min);
        System.out.println("Byte Max Value is: " + max);

        // get the byte number
        byte a = 'a';
        String b = "127";
        // causes an error, use try/catch block
        String c = "128";

        //print valuesOf
        System.out.println(Byte.valueOf(a));
        System.out.println(Byte.valueOf(b));
        // try catch block for finding value of String c
        try {
            System.out.println(Byte.valueOf(c));
        } catch (NumberFormatException exc) {
            System.out.println("Error String value out of range!");
        }

        // Cast byte to other primitives
        byte d = 65;
        short e = ((short) d);
        int f = ((int) d);
        char g = ((char) d);
        long h = ((long) d);
        float i = ((float) d);
        double j = ((double) d);
        String k = Byte.toString(d);
        System.out.println("The value of byte e is: " + d);
        System.out.println("byte to short is: " + e);
        System.out.println("byte to int is: " + f);
        System.out.println("byte to char is: " + g);
        System.out.println("byte to long is: " + h);
        System.out.println("byte to float is: " + i);
        System.out.println("byte to double is: " + j);
        System.out.println("byte to string is: " + k);

        // Byte Decode & ParseByte Method
        System.out.println("byte decode takes a number as string like " +
                "\"127\" and changes it to byte: " + Byte.decode("127"));
        System.out.println(Byte.parseByte("1"));

        // Byte Compare
        System.out.println("Compare bytes");
        System.out.println(Byte.compare(d, (byte)g)); // returns 0 if equal
        System.out.println("Byte value of byte d compared to Byte value of String K: " + Byte.valueOf(d).compareTo(Byte.valueOf(k)));

        // Print all Byte values from min to max
        for (byte l = min; l < max; l++) System.out.println(l);
    }
}
