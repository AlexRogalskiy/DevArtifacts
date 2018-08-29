package ru.postlike;

/**
 * Created with IntelliJ IDEA.
 * User: misha_ring
 * Date: 10/8/13
 * Time: 3:17 PM
 * To change this template use File | Settings | File Templates.
 */
public class Apfd {
    public static void main(String[] args) {
//        System.out.println("xx = " + "xx");
//        System.out.println(new Apfd().getClass().getClass());
//        System.out.println(new Apfd().new Aff().getClass().getClass().getClass());
        Aff fdf = new Apfd().new Aff();
        fdf.start();
        System.out.println("args = " + fdf.i);
    }

    public class Aff extends Thread {
        int i;
        @Override
        public void run() {
            i++;
        }
    }
}
