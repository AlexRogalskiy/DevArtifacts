import java.util.*;
import java.math.BigInteger;

public class FibonacciLastDigit {
    private static String getFibonacciLastDigitNaive(int n) {
        if (n <= 1)
            return String.valueOf(n);
        BigInteger[] arr = new BigInteger[n+2];
        arr[0]= BigInteger.ZERO;
        arr[1]=BigInteger.ONE;
        BigInteger previous =  BigInteger.ZERO;
        BigInteger current  = BigInteger.ONE;

        for (int i = 2; i <=n ; ++i) {
            //BigInteger tmp_previous = previous;
            //previous = current;
            arr[i] = arr[i-1].add(arr[i-2]);
        }

        return current.mod(BigInteger.TEN).toString();
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        String c = getFibonacciLastDigitNaive(n);
        System.out.println(c);
    }
}

