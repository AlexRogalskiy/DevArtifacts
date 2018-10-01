#include <mpi.h>

// MPI sample program; not intended to be efficient; finds and reports
// the number of primes less than or equal to n

// Uses a pipeline approach:  node 0 looks at all the odd numbers (i.e.,
// we assume multiples of 2 are already filtered out) and filters out
// those that are multiples of 3, passing the rest to node 1; node 1
// filters out the multiples of 5, passing the rest to node 2; node 2
// filters out the rest of the composites and then reports the number
// of primes 

// the command-line arguments are n and debugwait

#define PIPE_MSG 0  // type of message containing a number to 
                    // be checked 
#define END_MSG 1  // type of message indicating no more data will
                   // be coming 

int nnodes,  // number of nodes in computation
    n,  // find all primes from 2 to n 
    me;  // my node number 

init(int argc,char **argv)
{  int debugwait;  // if 1, then loop around until the
                   // debugger has been attached

   MPI_Init(&argc,&argv);
   n = atoi(argv[1]); 
   debugwait = atoi(argv[2]);

   MPI_Comm_size(MPI_COMM_WORLD,&nnodes);
   MPI_Comm_rank(MPI_COMM_WORLD,&me); 
      
   while (debugwait) ;
}

void node0()
{  int i,dummy,
       tocheck; // current number to check for passing on to next node
   for (i = 1; i <= n/2; i++)  {
      tocheck = 2 * i + 1;
      if (tocheck > n) break;
      if (tocheck % 3 > 0)
         MPI_Send(&tocheck,1,MPI_INT,1,PIPE_MSG,MPI_COMM_WORLD);
   }
   MPI_Send(&dummy,1,MPI_INT,1,END_MSG,MPI_COMM_WORLD);
}

void node1()
{  int tocheck,  // current number to check from node 0 
       dummy;
   MPI_Status status;  // see below 

   while (1)  {
      MPI_Recv(&tocheck,1,MPI_INT,0,MPI_ANY_TAG,
         MPI_COMM_WORLD,&status);
      if (status.MPI_TAG == END_MSG) break;
      if (tocheck % 5 > 0) 
         MPI_Send(&tocheck,1,MPI_INT,2,PIPE_MSG,MPI_COMM_WORLD);
   }
   // now send our end-of-data signal, which is conveyed in the
   // message type, not the message itself 
   MPI_Send(&dummy,1,MPI_INT,2,END_MSG,MPI_COMM_WORLD);
}

void node2()
{  int tocheck,  // current number to check from node 1 
       primecount,i,iscomposite;
   MPI_Status status;  

   primecount = 3;  // must account for the primes 2, 3 and 5, which
                    // won't be detected below 
   while (1)  {
      MPI_Recv(&tocheck,1,MPI_INT,1,MPI_ANY_TAG,
         MPI_COMM_WORLD,&status);
      if (status.MPI_TAG == END_MSG) break;
      iscomposite = 0;
      for (i = 7; i*i <= tocheck; i += 2)
         if (tocheck % i == 0)  {
	    iscomposite = 1;
	    break;
	 }
      if (!iscomposite) primecount++;  
   }
   printf("number of primes = %d\n",primecount);
}

main(int argc,char **argv)
{  init(argc,argv);
   switch (me)  {
      case 0:  node0();
	  break;
      case 1:  node1();
          break;
      case 2:  node2();
   };
   MPI_Finalize();
}
