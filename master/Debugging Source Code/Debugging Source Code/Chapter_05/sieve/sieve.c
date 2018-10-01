// finds the primes between 2 and n; uses the Sieve of Eratosthenes,
// deleting all multiples of 2, all multiples of 3, all multiples of 5,
// etc.; not efficient, e.g. each thread should do deleting for a whole
// block of values of base before going to nextbase for more 

// usage:  sieve nthreads n
// where nthreads is the number of worker threads

#include <stdio.h>
#include <math.h>
#include <pthread.h>  

#define MAX_N 100000000
#define MAX_THREADS 100

// shared variables
int nthreads,  // number of threads (not counting main())
    n,  // upper bound of range in which to find primes
    prime[MAX_N+1],  // in the end, prime[i] = 1 if i prime, else 0
    nextbase;  // next sieve multiplier to be used

int work[MAX_THREADS];  // to measure how much work each thread does,
                        // in terms of number of sieve multipliers checked

// lock index for the shared variable nextbase
pthread_mutex_t nextbaselock = PTHREAD_MUTEX_INITIALIZER;

// ID structs for the threads
pthread_t id[MAX_THREADS];

// "crosses out" all multiples of k, from k*k on
void crossout(int k)
{  int i;

   for (i = k; i*k <= n; i++)  {
      prime[i*k] = 0;
   }
}

// worker thread routine
void *worker(int tn)  // tn is the thread number (0,1,...)
{  int lim,base;

   // no need to check multipliers bigger than sqrt(n)
   lim = sqrt(n);

   do  {
      // get next sieve multiplier, avoiding duplication across threads
      pthread_mutex_lock(&nextbaselock);
      base = nextbase += 2;
      pthread_mutex_unlock(&nextbaselock);
      if (base <= lim)  {
         work[tn]++;  // log work done by this thread
         // don't bother with crossing out if base is known to be
         // composite
         if (prime[base])  
            crossout(base);
      }
      else return; 
   } while (1);
}

main(int argc, char **argv)
{  int nprimes,  // number of primes found 
       totwork,  // number of base values checked
       i;
   void *p;

   n = atoi(argv[1]);
   nthreads = atoi(argv[2]);
   for (i = 2; i <= n; i++) 
      prime[i] = 1;
   crossout(2);
   nextbase = 1;
   // get threads started
   for (i = 0; i < nthreads; i++)  {
      pthread_create(&id[i],NULL,(void *) worker,(void *) i);
   }

   // wait for all done
   totwork = 0;
   for (i = 0; i < nthreads; i++)  {
      pthread_join(id[i],&p);
      printf("%d values of base done\n",work[i]);
      totwork += work[i];
   }
   printf("%d total values of base done\n",totwork);
   
   // report results
   nprimes = 0;
   for (i = 2; i <= n; i++)  
      if (prime[i]) nprimes++;
   printf("the number of primes found was %d\n",nprimes);

}
