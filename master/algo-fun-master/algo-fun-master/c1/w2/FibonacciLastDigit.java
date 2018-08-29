import java.util.*;
import java.math.BigInteger;

public class FibonacciLastDigit {
    private static String getFibonacciLastDigitNaive(int n) {
        if (n <= 1)
            return String.valueOf(n);
        BigInteger[] arr = new BigInteger[62];
        arr[0]= BigInteger.ZERO;
        arr[1]=BigInteger.ONE;
        BigInteger previous =  BigInteger.ZERO;
        BigInteger current  = BigInteger.ONE;

        for (int i = 2; i <=61 ; ++i) {
            BigInteger tmp_previous = previous;
            previous = current;
            current = tmp_previous.add(current);
            arr[i] = current.mod(BigInteger.TEN);
        }

        return (arr[n % 60]).toString();
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        String c = getFibonacciLastDigitNaive(n);
        System.out.println(c);
    }
}

