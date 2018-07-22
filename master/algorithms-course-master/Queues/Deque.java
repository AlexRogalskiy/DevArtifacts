import java.util.Iterator;
import java.util.NoSuchElementException;

public class Deque<Item> implements Iterable<Item>
{
	private Node first;
	private Node last;
	private int size;
	
	private class Node 
	{
		public Node next = null;
		public Node previous = null;
		public Item item = null;
	}
	
	private class NodeIterator implements Iterator<Item>
	{
		private Node currentNode = first;
		
		public Item next()
		{
			if (!hasNext()) {
				throw new NoSuchElementException("The queue is empty");
			}
			
			Node node = currentNode;
			currentNode = node.next;
			
			return node.item;
		}
		
		public boolean hasNext()
		{
			return currentNode != null;
		}
		
		public void remove()
		{
			throw new UnsupportedOperationException("Remove operation is not supported");
		}
	}

   public Deque()
   {
	   first = null;
	   last = null;
	   size = 0;
   }
   
   public boolean isEmpty()
   {
	   return size == 0;
   }
   
   public int size()
   {
	   return size;
   }
   
   public void addFirst(Item item)
   {
	   validateItem(item);
	   
	   if (first == null) {
		   first = new Node();
		   first.item = item;
		   
		   if (last == null) {
			   last = first;
		   }
		   
	   } else {
		   Node oldFirst = first;
		   
		   first = new Node();
		   first.next = oldFirst;
		   first.item = item;
		   
		   oldFirst.previous = first;		   
	   }

	   size++;
   }
   
   public void addLast(Item item)
   {
	   validateItem(item);
	   
	   if (last == null) {
		   last = new Node();
		   last.item = item;
		   
		   if (first == null) {
			   first = last;  
		   }

	   } else {
		   Node oldLast = last;
		   
		   last = new Node();
		   last.previous = oldLast;
		   last.item = item;
		   
		   oldLast.next = last; 
	   }

	   size++;
   }
   
   private void validateItem(Item item)
   {
	   if (item == null) {
		   throw new IllegalArgumentException("Item cannot be null");
	   }
   }
   
   public Item removeFirst()
   {
	   checkNotEmpty();
	   
	   Node oldFirst = first;
	   first = oldFirst.next;
	   
	   if (first != null) {
		   first.previous = null;
	   } else if (size == 1) {
		   last = null;
	   } else {
		   first = last.previous;
	   }
	   
	   size--;

	   return oldFirst.item;
   }
   
   public Item removeLast()
   {
	   checkNotEmpty();
	   
	   Node oldLast = last;
	   last = last.previous;
	   
	   if (last != null) {
		   last.next = null;
	   } else if (size == 1) {
		   first = null;
	   } else {
		   last = first.next;
	   }
	   
	   size--;

	   return oldLast.item;
   }
   
   private void checkNotEmpty()
   {
	   if (isEmpty()) {
		   throw new NoSuchElementException("The queue is empty");
	   }
   }
   
   public Iterator<Item> iterator()         // return an iterator over items in order from front to end
   {
	   return new NodeIterator();
   }
}
