import java.io.File;
import java.io.IOException;
import java.util.Scanner;

public class Main {

    public static void main(String args[]) {
        Scanner scan1 = null;
        Scanner scan2 = null;
        try {
            scan1 = new Scanner(new File("File1.txt"));
            scan2 = new Scanner(new File("File2.txt"));
            // Do useful stuff
        } catch (IOException e) {
            // Oops!
        } finally {
            scan1.close();
            scan2.close();
            System.out.println("Done!");
        }
    }
}
