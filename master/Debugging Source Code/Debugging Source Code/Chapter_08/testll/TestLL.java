// usage:  [java] TestLL list_of_test_integers

// simple example program; reads integers from the command line,
// storing them in a linear linked list, maintaining ascending order,
// and then prints out the final list to the screen

public class TestLL  
{  
   public static void main(String[] Args) {
      int NumElements = Args.length;
      LinkedList LL = new LinkedList();
      for (int I = 1; I <= NumElements; I++)  {
         int Num;  
         // do C's "atoi()", using parseInt()
         Num = Integer.parseInt(Args[I-1]); 
         Node NN = new Node(Num);
         LL.Insert(NN);
      }
      System.out.println("final sorted list:");
      LL.PrintList();
   } 
}
