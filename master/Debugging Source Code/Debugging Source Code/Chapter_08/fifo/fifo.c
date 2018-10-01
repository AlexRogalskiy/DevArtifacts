// fifo.c, SWIG example; manages a FIFO queue of characters

char *fifo;  // the queue

int nfifo = 0,  // current length of the queue
    maxfifo;  // max length of the queue

int fifoinit(int spfifo)  // allocate space for a max of spfifo elements
{  fifo = malloc(spfifo);  
   if (fifo == 0) return 0;  // failure
   else  {
      maxfifo = spfifo;
      return 1;  // success
   }
}

int fifoput(char c)  // append c to queue 
{  if (nfifo < maxfifo)  {
      fifo[nfifo] = c;
      return 1;  // success
   }
   else return 0;  // failure
}

char fifoget()  // delete head of queue and return
{  char c;
   if (nfifo > 0)  {
      c = fifo[0];
      memmove(fifo,fifo+1,--nfifo);
      return c;
   }
   else return 0;  // assume no null characters ever in queue
}
