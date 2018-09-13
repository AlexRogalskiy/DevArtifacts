import static java.lang.System.out;

import java.util.Iterator;
import java.util.Scanner;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;

public class ShowNames {

    public static void main(String args[]) throws IOException {
        ArrayList<String> people = new ArrayList<String>();
        Scanner diskScanner = new Scanner(new File("names.txt"));

        while (diskScanner.hasNext()) {
            people.add(diskScanner.nextLine());
        }

        people.remove(0);
        people.add(2, "Jim Newton");
       
        Iterator<String> iterator = people.iterator();
        while (iterator.hasNext()) {
            out.println(iterator.next());
        }
        
        diskScanner.close();
    }
}
