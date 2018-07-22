import java.util.Iterator;
import java.util.NoSuchElementException;
import edu.princeton.cs.algs4.StdRandom;

public class RandomizedQueue<Item> implements Iterable<Item> {
	
	private Item[] queue;
	private int pointer = 0;
	private int size = 0;
	private int arraySize = 2;
    
	private class QueueIterator implements Iterator<Item>
	{	
		private Item[] iteratorQueue;
		private int iteratorPointer;
		
		
		public QueueIterator()
		{
			iteratorPointer = size - 1;
			iteratorQueue = queue;
		}
		
		public Item next()
		{
			if (!hasNext()) {
				throw new NoSuchElementException("The queue is empty");
			}
			
			int randomPointer = iteratorPointer;
			
			if (randomPointer > 0) {
				randomPointer = StdRandom.uniform(iteratorPointer);
			}
			
			Item item = iteratorQueue[randomPointer];
			iteratorPointer--;
			
			if(randomPointer != iteratorPointer) {
				iteratorQueue[randomPointer] = iteratorQueue[iteratorPointer];
			}
			
			return item;
		}
		
		public boolean hasNext()
		{
			return pointer > -1;
		}
		
		public void remove()
		{
			throw new UnsupportedOperationException("Remove operation is not supported");
		}
	}
	
    public RandomizedQueue()
    {
    	queue = (Item[]) new Object[arraySize];
    }
    
    public boolean isEmpty()
    {
    	return size == 0;
    }
    
    public int size()
    {
    	return size;
    }
    
    public void enqueue(Item item)
    {
 	    if (item == null) {
		    throw new IllegalArgumentException("Item cannot be null");
	    }

 	    if (pointer >= arraySize) {
 	    	resizeArray((size + 1) * 2);
 	    }
 	    
 	    queue[pointer] = item;
 	    pointer++;
    	size++;
    }
    
    public Item dequeue()
    {
 	    if (isEmpty()) {
		    throw new NoSuchElementException("The queue is empty");
	    }
 	    
 	    int randomNumber = 0;
 	   
 	    if (size > 1) {
 		   randomNumber = StdRandom.uniform(size - 1);
 	    }

 	    Item returnItem = queue[randomNumber];
 	   
 	    pointer--;
 	    
 	    if (size != pointer) {
 	    	queue[randomNumber] = queue[pointer];
 	    }
    	
    	if (size <= arraySize / 4) {
    		resizeArray(arraySize / 2);
    	}
    	
    	size--;

    	return returnItem;
    }
    
    private void resizeArray(int newArraySize)
    {    	
    	arraySize = newArraySize;
    	Item[] tempArray = (Item[]) new Object[arraySize];
    	int tempPointer = 0;
    	
    	for (int i = 0; i < size; i++) {
			tempArray[i] = queue[i];
			tempPointer++;
    	}
    	
    	queue = tempArray;
    	pointer = tempPointer;
    }
    
    public Item sample()
    {
 	    if (isEmpty()) {
		    throw new NoSuchElementException("The queue is empty");
	    }
 	    
 	    int randomNumber = 0;
  	   
 	    if (size > 1) {
 		   randomNumber = StdRandom.uniform(size - 1);
 	    }
 	    
	    return queue[randomNumber];
    }
    
    public Iterator<Item> iterator()
    {
    	return new QueueIterator();
    }
}