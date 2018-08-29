package PrimitivesPractice.BooleanPractice;

/***********************************************************
 * * Created by: Allen Whearry Jr
 * * Created on: Sep. 29, 2015
 * <p/>
 * * instagram.com/NoRest4AWhearry
 * <p/>
 * * Project: JavaPractice
 ************************************************************/
public class BooleanPractice {
    public static void main(String[] args) {

        boolean isDone = true;
        boolean isHere = true;
        boolean isGone = false;
        System.out.println(Boolean.getBoolean(Boolean.toString(isDone)));
        System.out.println(isDone);
        System.out.println(Boolean.valueOf(isDone).compareTo(Boolean.valueOf(isHere))); // if true value 0
        System.out.println(Boolean.compare(isDone, isHere)); // if true, value 0
        System.out.println(Boolean.compare(isDone, isGone));

    }
}