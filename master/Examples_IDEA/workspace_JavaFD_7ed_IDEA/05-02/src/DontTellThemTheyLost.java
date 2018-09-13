import static java.lang.System.in;
import static java.lang.System.out;
import java.util.Scanner;
import java.util.Random;

public class DontTellThemTheyLost {

    public static void main(String args[]) {
        Scanner keyboard = new Scanner(in);

        out.print("Enter an int from 1 to 10: ");

        int inputNumber = keyboard.nextInt();
        int randomNumber = new Random().nextInt(10) + 1;

        if (inputNumber == randomNumber) {
            out.println("*You win.*");
        }

        out.println("That was a very good guess :-)");
        out.print("The random number was ");
        out.println(randomNumber + ".");
        out.println("Thank you for playing.");

        keyboard.close();
    }
}
