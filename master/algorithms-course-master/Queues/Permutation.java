import java.util.Iterator;
import edu.princeton.cs.algs4.StdIn;

public class Permutation {
	public static void main(String[] args)
	{
		RandomizedQueue<String> queue = new RandomizedQueue<String>();
		
		int numberOfInputs = Integer.parseInt(args[0]);
		
		while (!StdIn.isEmpty()) {
			queue.enqueue(StdIn.readString());
		}
		
		Iterator<String> queueIterator = queue.iterator();
		
		for (int i = 0; i < numberOfInputs; i++) {
			System.out.println(queueIterator.next());
		}
	}
}
