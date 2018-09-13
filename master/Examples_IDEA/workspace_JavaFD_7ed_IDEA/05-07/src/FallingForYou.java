import static java.lang.System.out;
import java.util.Scanner;

public class FallingForYou {

    public static void main(String args[]) {
        Scanner keyboard = new Scanner(System.in);
        out.print("Which verse? ");
        int verse = keyboard.nextInt();

        switch (verse) {
        case 3:
            out.print("Last refrain, ");
            out.println("last refrain,");
        case 2:
            out.print("He's a pain, ");
            out.println("he's a pain,");
        case 1:
            out.print("Has no brain, ");
            out.println("has no brain,");
        }

        out.println("In the rain, in the rain.");
        out.println("Ohhhhhhhh...");
        out.println();

        keyboard.close();
    }
}
