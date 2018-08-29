import java.util.Scanner;

public class Fibonacci {
  private static long calc_fib(int n) {
    if (n <= 1)
      return n;

    return calc_fib(n - 1) + calc_fib(n - 2);
  }

  public static void main(String args[]) {
    Scanner in = new Scanner(System.in);
    int n = in.nextInt();
    int[] fubNum = new int[n+3];
    fubNum[0]=0;
    fubNum[1]=1;
    fubNum[2]=1;
      if (n>=3) {
        for (int i=3; i<=n; i++) {
    	    fubNum[i]=fubNum[i-1] + fubNum[i-2];
    	    
        }
      }
    System.out.println(fubNum[n]);
  }
}
