package ArrayPractice;

import java.lang.reflect.Array;
import java.util.Arrays;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Sep. 29, 2015
 *
 * * instagram.com/NoRest4AWhearry
 *
 * * Project: JavaPractice
 ************************************************************/
public class ArraysPractice {
    public static void main(String[] args) {

        // Initialize Arrays
        int[] nums = new int[4];
        nums[0] = 1;
        nums[1] = 2;
        nums[2] = 3;
        nums[3] = 4;

        char[] chars = new char[]{'A', 'B', 'C', 'D'};
        float[] floats = {4, 3, 2, 1 };
        double[] doubles = new double[]{1.1, 2.2, 3.3, 4.4};
        boolean[] booleans = {true, false, true, false};
        String[] strings = new String[]{"I", "Like", "Cheese"};

        // print 1st number in each array
        System.out.println("integer in index 0 of nums is: "+ nums[0]);
        System.out.println("char in index 0 of chars is: "+ chars[0]);
        System.out.println("float in index 0 of floats is: "+ floats[0]);
        System.out.println("double in index 0 of doubles is: "+ doubles[0]);
        System.out.println("boolean in index 0 of booleans is: "+ booleans[0]);
        System.out.println("String in index 0 of strings is: "+ strings[0]);

        //Print Lengths of nums and strings
        System.out.println("Length of nums is: " + nums.length);
        System.out.println("Length of strings is: " + strings.length);

        // Array get method from lang.reflect.Array
        System.out.println("integer at index 1  of nums is: " + Array.get(nums, 1));
        System.out.println("char at index 2  of chars is: " + Array.get(chars, 2));
        System.out.println("float at index 0  of floats is: " + Array.get(floats, 0));
        System.out.println("double at index 4  of doubles is: " + Array.get(doubles, 3));
        System.out.println("boolean at index 1  of booleans is: " + Array.get(booleans, 1));
        System.out.println("string at index 3  of strings is: " + Array.get(strings, 2));

        // Array set method sets a new value in place of old value in designated index
        Array.set(nums, 1, 6);
        System.out.println("nums integer at index 1's new value is: " + nums[1]);

        // Arrays methods from java.util.Arrays
        System.out.println("1 is at index " + Arrays.binarySearch(nums, 1) + " of nums array");

        // Arrays fill method from java.util.Arrays, fills array with designated value
        boolean[] b = new boolean[4];
        Arrays.fill(b, true);

        for (boolean aB : b) { // optimized for loop (for each loop)
            System.out.print(aB);
            System.out.print(" ");
        }
        System.out.println();

        int[] i = new int[]{1,2,3,4,5,6,7,8};
        Arrays.fill(i, 2, 7, 3); // fills i with 3s from index 2 - index 7
        for (int j = 0; j < i.length; j++) {
            System.out.print(i[j]);
        }
        System.out.println();

        // sort method from java.util.Arrays
        int[] ints = {1,9,2,8,3,7,4,6,5};
        int[] ints2 = {1,9,2,8,3,7,4,6,5};

        Arrays.sort(ints);
        for (int j = 0; j < ints.length; j++) {
            System.out.print(ints[j]);
        }
        System.out.println();

        Arrays.sort(ints2, 2, 8);
        for (int j = 0; j < ints2.length; j++) {
            System.out.print(ints2[j]);
        }
        System.out.println();

        // toString method from java.util.Arrays Returns string
        // representation of array items.
        System.out.println("Contents of nums array are: " + Arrays.toString(nums));
        System.out.println("Contents of chars array are: " + Arrays.toString(chars));
        System.out.println("Contents of floats array are: " + Arrays.toString(floats));
        System.out.println("Contents of doubles array are: " + Arrays.toString(doubles));
        System.out.println("Contents of booleans array are: " + Arrays.toString(booleans));
        System.out.println("Contents of strings array are: " + Arrays.toString(strings));
        System.out.println("Contents of ints array are: " + Arrays.toString(ints));
        System.out.println("Contents of ints2 array are: " + Arrays.toString(ints2));
        System.out.println("Contents of b array are: " + Arrays.toString(b));


    }
}
