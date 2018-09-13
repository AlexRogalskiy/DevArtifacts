import static java.lang.System.out;
import java.util.Scanner;

public class SwitchIt7 {

    public static void main(String args[]) {
       Scanner keyboard = new Scanner(System.in);
       out.print("Which verse (one, two or three)? ");
       String verse = keyboard.next();

       switch (verse) {
       case "one":
          out.println("That's because he has no brain.");
          break;
       case "two":
          out.println("That's because he is a pain.");
          break;
       case "three":
          out.println("'Cause this is the last refrain.");
          break;
       default:
          out.println("No such verse. Please try again.");
          break;
       }

       out.println("Ohhhhhhhh. . . .");

       keyboard.close();
    }
}
