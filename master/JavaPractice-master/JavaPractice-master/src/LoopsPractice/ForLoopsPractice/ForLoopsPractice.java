package LoopsPractice.ForLoopsPractice;

import java.util.*;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Sep. 30, 2015
 *
 * * instagram.com/NoRest4AWhearry
 *
 * * Project: JavaPractice
 ************************************************************/
public class ForLoopsPractice {

    public static void main(String[] args) {

        // Print numbers 0 - 9
        for (int i = 0; i <= 9; i++) {
            System.out.print(i);
        }
        System.out.println();

        //////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////

        // Print numbers 9 - 0
        for (int i = 9; i >= 0; i--) {
            System.out.print(i);
        }
        System.out.println();

        //////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////

        // sum of number from 1-9
        int sum = 0;
        for (int i = 1; i <= 9; i++) {
            sum += i;
        }
        System.out.println(sum);

        //////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////

        // print letters A - Z
        for (char i = 'A'; i <= 'Z'; i++) {
            System.out.print(i);
        }
        System.out.println();

        //////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////

        // initialize array & create a string version with the same output as Arrays.toString() method
        int[] nums = new int[]{1,2,3,4,5,6,7,8,9};
        String result = "[";
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == nums[nums.length - 1]) {
                result += String.format("%d]", nums[i]);
            } else {
                result += String.format("%d, ", nums[i]);
            }
        }
        // test to see if strings match
        System.out.println(result);
        System.out.println(Arrays.toString(nums));
        System.out.println(result.equals(Arrays.toString(nums)));

        //////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////

    }
}
