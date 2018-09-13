import java.io.File;
import java.io.IOException;
import java.util.Scanner;

public class NewMain {

    public static void main(String args[]) {
        try (Scanner scan1 = new Scanner(new File("File1.txt"));
             Scanner scan2 = new Scanner(new File("File2.txt"))) {
            // Do useful stuff
        } catch (IOException e) {
            // Oops!
        }
        System.out.println("Done!");
    }
}
