import static java.lang.System.out;
import java.util.Scanner;

public class JustSwitchIt {

    public static void main(String args[]) {
       Scanner keyboard = new Scanner(System.in);
       out.print("Which verse? ");
       int verse = keyboard.nextInt();

       switch (verse) {
       case 1:
          out.println("That's because he has no brain.");
          break;
       case 2:
          out.println("That's because he is a pain.");
          break;
       case 3:
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
