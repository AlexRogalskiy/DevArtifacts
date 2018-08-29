import java.util.*;
import java.math.BigInteger;



public class LCM {

 private static long gcd_naive(long p, long q) {
     while (q != 0) {
                 long temp = q;
                             q = p % q;
                                         p = temp;
                                                 }
                                                         return p;
  }
  public static void main(String args[]) {
    Scanner scanner = new Scanner(System.in);
    int a = scanner.nextInt();
    int b = scanner.nextInt();

    System.out.println(a * (b / gcd_naive(a, b)));
  }
}
