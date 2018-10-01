// LinkedList.java, implementing an ordered linked list of integers

public class LinkedList  
{  
   public static Node Head = null; 

   public LinkedList()  {
      Head = null;
   }

   // inserts a node N into this list
   public void Insert(Node N)  {
      if (Head == null)  {
         Head = N;  
         return;
      }
      if (N.Value < Head.Value)  {
         N.Next = Head;
         Head = N;
         return;
      }
      else if (Head.Next == null)  {
         Head.Next = N;
         return;
      }
      for (Node D = Head; D.Next != null; D = D.Next)  {
         if (N.Value < D.Next.Value)  {
            N.Next = D.Next;
            D.Next = N;
            return;
         }
      }
   }

   public static void PrintList()  {
      if (Head == null) return;
      for (Node D = Head; D != null; D = D.Next)  
         System.out.println(D.Value);
   }
}
