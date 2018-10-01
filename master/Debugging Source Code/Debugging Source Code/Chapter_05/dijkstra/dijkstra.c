
%%% CHAPTER 5

\chapter{Debugging in a Multiple-Activities Context}
\label{chap:debugginginamultipleactivitiescontext} 

\chapterartfile{debug_circleart}

\index{multiprogramming techniques|(}

Debugging is a difficult task, and it becomes even more challenging when the
misbehaving application is trying to coordinate multiple, simultaneous
activities; client/server network programming, programming with threads, and
parallel processing are examples of this paradigm. This chapter presents an
overview of the most commonly used multiprogramming techniques and offers some
tips on how to deal with bugs in these kinds of programs, focusing on the use
of GDB/DDD/Eclipse in the debugging process.

\section{Debugging Client/Server Network Programs}

\index{multiprogramming techniques!client/server network programs|(}
\index{client/server network programs, multiprogramming techniques|(}
\index{networks, multiprogramming techniques for client/server network
programs|(}  

Computer networks are extremely complex systems, and rigorous
debugging of networked software applications can sometimes require the
use of hardware monitors to collect detailed information about the
network traffic.  An entire book could be written on this debugging
topic alone. Our goal here is to simply introduce the subject.

Our example consists of the following \textit{client/server pair}\/. The
client application allows a user to check the load on the machine on
which the server application runs, even if the user does not have an
account on the latter machine. The client sends a request for information
to the server---here, a query about the load on the server's system, via
the Unix \texttt{w} command---over a network connection.  The server then
processes the request and returns the results, capturing the output
of \texttt{w} and sending it back over the connection. In general, a
server can accept requests from multiple remote clients; to keep things
simple in our example, let's assume there is only one instance of the client.

The code for the server is shown below:

\begin{Code}[numbers=left]
// srvr.c

//  a server to remotely run the w command
//  user can check load on machine without login privileges
//  usage:  svr

#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <fcntl.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>

#define WPORT 2000  
#define BUFSIZE 1000  // assumed sufficient here

int clntdesc,  // socket descriptor for individual client
    svrdesc;  // general socket descriptor for server 

char outbuf[BUFSIZE];  // messages to client 

void respond()
{  int fd,nb;
        
   memset(outbuf,0,sizeof(outbuf));  // clear buffer 
   system("w > tmp.client");  // run 'w' and save results
   fd = open("tmp.client",O_RDONLY);
   nb = read(fd,outbuf,BUFSIZE);  // read the entire file
   write(clntdesc,outbuf,nb);  // write it to the client
   unlink("tmp.client");  // remove the file
   close(clntdesc);
}

int main()
{  struct sockaddr_in bindinfo;

   // create socket to be used to accept connections
   svrdesc = socket(AF_INET,SOCK_STREAM,0);
   bindinfo.sin_family = AF_INET;
   bindinfo.sin_port = WPORT;
   bindinfo.sin_addr.s_addr = INADDR_ANY;
   bind(svrdesc,(struct sockaddr *) &bindinfo,sizeof(bindinfo));

   // OK, listen in loop for client calls 
   listen(svrdesc,5); 
   
   while (1)  {
      // wait for a call 
      clntdesc = accept(svrdesc,0,0);
      // process the command 
      respond();
   }
}
\end{Code}

Here is the code for the client:

\begin{Code}[numbers=left]
// clnt.c

// usage:  clnt server_machine 

#include <stdio.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <string.h>
#include <unistd.h>

#define WPORT 2000  // server port number 
#define BUFSIZE 1000

int main(int argc, char **argv)
{  int sd,msgsize;

   struct sockaddr_in addr;
   struct hostent *hostptr;
   char buf[BUFSIZE];

   // create socket 
   sd = socket(AF_INET,SOCK_STREAM,0);
   addr.sin_family = AF_INET;
   addr.sin_port = WPORT;
   hostptr = gethostbyname(argv[1]);
   memcpy(&addr.sin_addr.s_addr,hostptr->h_addr_list[0],hostptr->h_length);

   // OK, now connect 
   connect(sd,(struct sockaddr *) &addr,sizeof(addr));

   // read and display response 
   msgsize = read(sd,buf,BUFSIZE);
   if (msgsize > 0)
      write(1,buf,msgsize);
   printf("\n");
   return 0;
}
\end{Code}

For those unfamiliar with client/server programming, here is an
overview of how the programs work:

On line 41 of the server code, you create a \textit{socket}\/,\index{sockets,
using} which is an
abstraction similar to a file descriptor; just as one uses a file
descriptor to perform I/O operations on a filesystem object, one reads
from and writes to a network connection via a socket.  On line 45, the
socket is bound to a specific \textit{port number}\/, arbitrarily chosen
to be 2000.  (User-level applications such as this one are restricted to
port numbers of 1024 and higher.) This number identifies a ``mailbox''
on the server's system to which clients send requests to be processed
for this particular application. 

The server ``opens for business'' by calling {\tt listen()} on line 48.
It then waits for a client request to come in by calling {\tt accept()}
on line 52.  That call blocks until a request arrives. It then returns a
new socket for communicating with the client. (When there are multiple
clients, the original socket continues to accept new requests even while
an existing request is being serviced, hence the need for separate
sockets. This would require the server to be implemented in a threaded
fashion.)  The server processes the client request with the
\texttt{respond()} function and sends the machine load information to the
client by locally invoking the \texttt{w} command and writing the
results to the socket in line 32.

The client creates a socket on line 24 and then uses it on line 31
to connect to the server's port 2000.  On line 34, it reads the load
information sent by the server and then prints it out.

Here is what the output of the client should look like:

\begin{Code}
$ clnt laura.cs.ucdavis.edu
 13:00:15 up 13 days, 39 min,  7 users,  load average: 0.25, 0.13, 0.09
USER     TTY      FROM              LOGIN@   IDLE   JCPU   PCPU WHAT
matloff  :0       -                14Jun07 ?xdm?  25:38   0.15s -/bin/tcsh -c /
matloff  pts/1    :0.0             14Jun07 17:34   0.46s  0.46s -csh
matloff  pts/2    :0.0             14Jun07 18:12   0.39s  0.39s -csh
matloff  pts/3    :0.0             14Jun07 58.00s  2.18s  2.01s /usr/bin/mutt
matloff  pts/4    :0.0             14Jun07  0.00s  1.85s  0.00s clnt laura.cs.u
matloff  pts/5    :0.0             14Jun07 20.00s  1.88s  0.02s script
matloff  pts/7    :0.0             19Jun07  4days 22:17   0.16s -csh
\end{Code}

Now suppose the programmer had forgotten line~26 in the client code,
which specifies the port on the server's system to connect to:

\begin{Code}
addr.sin_port = WPORT;
\end{Code}

Let's pretend we don't know what the bug is and see how we might
track it down.

The client's output would now be

\begin{Code}
$ clnt laura.cs.ucdavis.edu

$ 
\end{Code}

It appears that the client received nothing at all back from the server.
This of course could be due to a variety of causes in either the server
or the client, or both.

Let's take a look around, using GDB\@.  First, check to see that the
client actually did succeed in connecting to the server.  Set a
breakpoint at the call to {\tt connect()}, and run the program: 

\begin{Code}
(gdb) b 31
Breakpoint 1 at 0x8048502: file clnt.c, line 31.
(gdb) r laura.cs.ucdavis.edu
Starting program: /fandrhome/matloff/public_html/matloff/public_html/Debug
/Book/DDD/clnt laura.cs.ucdavis.edu

Breakpoint 1, main (argc=2, argv=0xbf81a344) at clnt.c:31
31         connect(sd,(struct sockaddr *) &addr,sizeof(addr));
\end{Code}

Use GDB to execute the \texttt{connect()} and check the return
value for an error condition:

\begin{Code}
(gdb) p connect(sd,&addr,sizeof(addr))
$1 = -1
\end{Code}

It is indeed \texttt{-1}, the code for failure. That is a big hint. (Of
course, as a matter of defensive programming, when we wrote the client
code, we would have checked the return value of {\tt connect()} and
handled the case of failure to connect.)

By the way, note that in manually executing the call to
\texttt{connect()}, you have to remove the cast.  With the cast
retained, you'd get an error:

\pagebreak

\vspace{6pt}
\begin{lstlisting}[frame=lines]
(gdb) p connect(sd,(struct sockaddr *) &addr,sizeof(addr))
No struct type named sockaddr.
\end{lstlisting}
\vspace{6pt}

This is due to a quirk in GDB, and it arises because we haven't used the
struct elsewhere in the program.

Also note that if the {\tt connect()} attempt had succeeded in the GDB
session, you could \emph{not}\/ have then gone ahead and executed line
31. Attempting to open an already-open socket is an error.

You would have had to skip over line 31 and go directly to line
34.  You could do this using GDB's {\tt jump} command, issuing {\tt jump
34}, but in general you should use this command with caution, as it
might result in skipping some machine instructions that are needed
further down in the code.  So, if the connection attempt had succeeded,
you would probably want to rerun the program.

Let's try to track down the cause of the failure by checking the
argument {\tt addr} in the call to {\tt connect()}:

\begin{Code}
(gdb) p addr
... 
connect(3, {sa_family=AF_INET, sin_port=htons(1032),
sin_addr=inet_addr("127.0.0.1")}, 16) = -1 ECONNREFUSED (Connection refused)
...
\end{Code}
%stopzone

Aha!  The value {\tt htons(1032)} indicates port 2052 (see below), not the 2000
we expect.  This suggests that you either
misspecified the port or forgot to specify it altogether.  If you check, you'll
quickly discover that the latter was the case.

Again, it would have been prudent to include a bit of machinery in the
source code to help the debugging process, such as checking the return
values of system calls.  Another helpful step is inclusion of the line

\begin{Code}
#include <errno.h>
\end{Code}
%stopzone

\setlength\parindent{0in}which, on our system, creates a global variable {\tt
errno}, whose value can be printed out from within the code or from within GDB:

\begin{Code}
(gdb) p errno
$1 = 111
\end{Code}  
%stopzone

\setlength\parindent{0.25in}From the file \emph{/usr/include/linux/errno.h}\/,
you find that this error number codes a {\it connection refused}\/ error.  

However, the implementation of the \texttt{errno} library may differ
from platform to platform. For example, the header file may have a
different name, or {\tt errno} may be implemented as a macro call
instead of a variable.

Another approach would be to use {\tt strace}, which traces all system
calls made by a program:  

\pagebreak

\vspace{6pt}
\begin{lstlisting}[frame=lines]
$ strace clnt laura.cs
...
connect(3, {sa_family=AF_INET, sin_port=htons(1032),
sin_addr=inet_addr("127.0.0.1")}, 16) = -1 ECONNREFUSED (Connection refused)
...
\end{lstlisting}
\vspace{6pt}

This gives you two important pieces of information for the price of one.
First, you see right away that there was an {\tt ECONNREFUSED} error.
Second, you also see that the port was {\tt htons(1032)}, which has the
value 2052.  You can check this latter value by issuing a command like

\begin{Code}
(gdb) p htons(1032)
\end{Code}

\setlength\parindent{0in}from within GDB, which shows the value to be 2052,
which obviously is not 2000, as expected.

\setlength\parindent{0.25in}You will find {\tt strace} to be a handy tool in
many contexts
(networked and otherwise) for checking the results of system calls.

As another example, suppose that you accidentally omit the write to
the client in the server code (line 32):

\begin{Code}
write(clntdesc,outbuf,nb);  // write it to the client
\end{Code}

In this case, the client program would hang, waiting for a reply that
is not forthcoming.  Of course, in this simpleminded example you'd
immediately suspect a problem with the call to {\tt write()} in the
server and quickly find that we had forgotten it. But in more complex
programs the cause may not be so obvious.  In such cases, you would
probably set up {\it two}\/ simultaneous GDB sessions, one for the
client and one for the server, stepping through {\it both}\/ of the
programs in tandem.  You would find that at some point in their joint
operation that the client hangs, waiting to hear from the server, and thus
obtain a clue to the likely location of the bug within the server.
You'd then focus your attention on the server GDB session, trying to
figure out why it did not send to the client at that point.

In really complex network debugging cases, the open source ethereal program can
be used to track individual TCP/IP packets.

\index{multiprogramming techniques!client/server network programs|)}
\index{client/server network programs, multiprogramming techniques|)}
\index{networks, multiprogramming techniques for client/server network
programs|)}


\section{Debugging Threaded Code}
\label{debugthreaded}

\index{multiprogramming techniques!threaded code|(}
\index{threads!multiprogramming techniques|(}  

Threaded programming has become quite popular.
For Unix, the most widespread threads package is the POSIX standard
Pthreads,\index{Pthreads, example} so we will use it for our example in this
section. The
principles are similar for other thread packages.

\subsection{Review of Processes and Threads}

\index{threads!about} 

Modern operating systems use {\it timesharing}\/ to manage multiple running
programs in such a way that they appear to the user to execute simultaneously.
Of course, if the machine has more than one CPU, more than one program actually
can run simultaneously, but for simplicity we will assume just one processor,
in which case the simultaneity is only apparent.

Each instance of a running program is represented by the OS as a {\it process}\/
(in Unix terminology) or a {\it task}\/ (in Windows).\index{processes, defined} 
Thus, multiple
invocations of a single program that execute at the same time (e.g.,
simultaneous sessions of the vi text editor) are distinct processes. Processes
have to ``take turns'' on a machine with one CPU.  For concreteness, let's
assume that the ``turns,'' called {\it timeslices}\/, are of length 30
milliseconds.

After a process has run for 30 milliseconds, a hardware timer emits an
interrupt, which causes the OS to run.  We say that the process has been {\it
pre-empted}\/.  The OS saves the current state of the interrupted process so it
can be resumed later, then selects the next process to give a timeslice to. 
This is known as a {\it context switch}\/,\index{|(context switching!defined} 
because the CPU's execution
environment has switched from one process to another.  This cycle repeats
indefinitely.

A turn may end early.  For example, when a process needs to perform
input/output, it ultimately calls a function in the OS that carries out
low-level hardware operations; for instance, a call to the C library
function {\tt scanf()} results in a call to the Unix OS {\tt read()}
system call, which interfaces with the keyboard driver.  In this manner
the process relinquishes its turn to the OS, and the turn ends early.

One implication of this is that scheduling of timeslices for a given
process is rather random.  The time it takes for the user to think and
then hit a key is random, so the time its next timeslice starts is
unpredictable.  Moreover, if you are debugging a threaded program, you do
not know the order in which the threads will be scheduled; this may make
debugging more \mbox{difficult.}

Here is a bit more detail:  The OS maintains a {\it process
table}\/\index{process tables, defined} that
lists information about all current processes.  Roughly speaking, each
process is marked in the table as being in either the Run state or the
Sleep state. Let's consider an example in which a running program
reaches a point at which it needs to read input from the keyboard.  As
just noted, this will end the process's turn. Because the process is now
waiting for the I/O to complete, the OS marks it as being in the Sleep
state, making it ineligible for time\-slices.  Thus, being in Sleep state
means that the process is blocked, waiting for some event to occur. When
this event finally occurs later on, the OS will then change its state in
the process table back to Run. 

Non-I/O events can trigger a transition to Sleep state as well.  For
instance, if a parent process creates a child process and calls {\tt
wait()}, the parent will block until the child finishes its work and
terminates. Again, exactly when this happens is usually unpredictable.

Furthermore, being in the Run state does not mean that the process is
actually executing on the CPU; rather, it merely means that it is
\textit{ready}\/ to run---that is, eligible for a processor timeslice.
Upon a context switch, the OS chooses the process that is next given a
turn on the CPU from among those currently in the Run state, according
to the process table. The scheduling procedure used by the OS to select
the new context guarantees that any given process will keep getting
timeslices, and so eventually finish, but there is no promise of
\textit{which}\/ timeslices it will receive. Thus, exactly when a sleeping
process actually ``awakens'' once the event that it awaits has occurred
is random, as is the exact rate of the process's progress toward
completion. 

A \textit{thread}\/\index{threads!defined} is much like a process, except that
it is
designed to occupy less memory and to take less time to create and
switch between than processes do. Indeed, threads are sometimes called
``lightweight'' processes and, depending on the thread system and
run-time environment, they may even be implemented as operating system
processes. Like programs that spawn processes to get work done, a
multithreaded application will generally execute a {\tt main()}
procedure that creates one or more child threads.  The parent, {\tt
main()}, is also a thread.

A major difference between processes and threads is that although each
thread has its own local variables, just as is the case for a process,
the global variables of the parent program in a threaded environment
are shared by all threads and serve as the main method of
communication between the threads.  (It is possible to share globals
among Unix processes, but in\-con\-ven\-ient to do so.)

On a Linux system, you can view all the processes and threads
currently on the system by running the command {\tt ps axH}.

There are nonpreemptive thread systems, but Pthreads uses a {\it
preemptive}\/ thread management policy, and a thread in a program can be
interrupted at any time by another thread. Thus, the element of
randomness described above for processes in a timeshared system also
arises in the behavior of a threaded program. As a result, some bugs
in applications developed using Pthreads are not readily reproducible.

\subsection{Basic Example}

\index{sample programs!threaded code|(} 

We'll keep things simple and use the following code for finding prime
numbers as an example.  The program uses the classic Sieve of
Eratosthenes.\index{Sieve of Eratosthenes}  To find all the primes from 2
through {\it n}, we first
list all the numbers, then cross out all the multiples of 2, then all
the multiples of 3, and so on.  Whatever numbers remain at the end
are prime numbers.

\begin{Code}[numbers=left]
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
\end{Code}

There are two command-line arguments in this program, the upper bound
{\tt n} of the range to be checked for primes, and {\tt nthreads}, the
number of worker threads we wish to create.

Here {\tt main()} creates the worker threads, each of which is an invocation of
the
function {\tt worker()}. The workers share three data items: the upper bound
variable, \textit{n}; the variable specifying the next number whose multiples
are to be eliminated from the range 2..{\it n}, \texttt{nextbase}; and the array
\texttt{prime[]} that records, for each number in the range 2..{\it n}, whether
or
not it has been eliminated.  Each invocation repeatedly fetches a
yet-to-be-processed elimination multiplicand, {\tt base}, and then eliminates
all multiples of {\tt base} from the range 2..{\it n}. After spawning the
workers,
{\tt main()} uses {\tt pthread\_join()} to wait for all these threads to finish
their work before resuming itself, at which point it counts the primes that are
left and issues its report.  The report includes not only the prime count, but
also information on how much work each worker thread did.  This assessment
is useful for {\it load balancing}\/ and performance optimization purposes on a
multiprocessor system.

Each instance of \texttt{worker()} fetches the next value of {\tt base} by
executing the following code (lines 49--51):

\begin{Code}
pthread_mutex_lock(&nextbaselock);
base = nextbase += 2;
pthread_mutex_unlock(&nextbaselock);
\end{Code}

Here, the global variable {\tt nextbase} is updated and used to initialize the
value of the \texttt{worker()} instance's local variable {\tt base}; the worker
then crosses out multiples of \texttt{base} in the array \texttt{prime[]}. (Note
that we started by eliminating all multiples of 2 at the beginning of
\texttt{main()}, and thereafter only need to consider odd values for {\tt
base}.)

Once the worker knows the value of \texttt{base} to use, it can safely cross out
the multiples of \texttt{base} from the shared array \texttt{prime[]}, because
no other worker will use that value of \texttt{base}. However, we have to place
\textit{guard statements}\/\index{guard statements, using} around the update
operation to the shared variable
\texttt{nextbase} that \texttt{base} depends upon (line 26). Recall that any
worker thread can be preempted, at an unpredictable time, by another worker
thread, which will be at an unpredictable place in the code for
\texttt{worker()}. In particular, it might just happen that the current worker
is interrupted in the midst of the statement

\begin{Code}
base = nextbase += 2;
\end{Code}

\setlength\parindent{0in}and the next timeslice is given to another thread that
is also executing the same statement. In this case, there are two workers
trying to modify the shared variable \texttt{nextbase} at once, which
can lead to insidious and hard-to-reproduce bugs.

\setlength\parindent{0.25in}Bracketing the code that manipulates the shared
variable---known as a \textit{critical section}\/---with\index{critical
sections, using} the guard statements
prevents this from happening. The calls to \texttt{pthread\_mutex\_lock()} and
\texttt{pthread\_mutex\_unlock()} ensure that there is at most only one
thread executing the enclosed program fragment. They tell the OS to allow a
thread to enter the critical section only if there is no other thread currently
executing it, and to not preempt that thread until it completes the entire
section.  (The \textit{lock variable}\/ \texttt{nextbaselock} is used internally
by the thread system to ensure this ``mutual exclusion.'')

Unfortunately, it's all too easy to fail to recognize and/or properly
protect critical sections in threaded code. Let's see how GDB can be
used to debug this sort of error in a Pthreads program. Suppose we had
forgotten to include the unlock statement,

\begin{Code}
pthread_mutex_unlock(&nextbaselock);
\end{Code}

This of course causes the program to hang once the critical section is
first entered by a worker thread, as the other worker threads will
wait forever for the lock to be relinquished. But let's pretend you
don't already know this. How do you track down the culprit using GDB?

Compile the progam, making sure to include the flags {\tt -lpthread
-lm} in order to link in the Pthreads and math libraries (the latter is
needed for thr call to {\tt sqrt()}). Then run the code in GDB,
with {\tt n = 100} and {\tt nthreads = 2}:

\begin{Code}
(gdb) r 100 2
Starting program: /debug/primes 100 2
[New Thread 16384 (LWP 28653)]
[New Thread 32769 (LWP 28676)]
[New Thread 16386 (LWP 28677)]
[New Thread 32771 (LWP 28678)]
\end{Code}

Each time a new thread is created, GDB announces it, as shown here.
We'll look into which thread is which in a moment.

The program hangs, and you interrupt it by pressing \textsc{ctrl}-C.
The GDB session now looks like this:

\begin{Code}
(gdb) r 100 2
Starting program: /debug/primes 100 2
[New Thread 16384 (LWP 28653)]
[New Thread 32769 (LWP 28676)]
[New Thread 16386 (LWP 28677)]
[New Thread 32771 (LWP 28678)]

Program received signal SIGINT, Interrupt.
[Switching to Thread 32771 (LWP 28678)]
0x4005ba35 in __pthread_sigsuspend () from /lib/i686/libpthread.so.0
\end{Code}

At a point like this it's crucial to know what each thread is doing,
which you can determine via GDB's {\tt info threads} command:

\begin{Code}
(gdb) info threads
* 4 Thread 32771 (LWP 28678)  0x4005ba35 in __pthread_sigsuspend ()
   from /lib/i686/libpthread.so.0
  3 Thread 16386 (LWP 28677)  0x4005ba35 in __pthread_sigsuspend ()
   from /lib/i686/libpthread.so.0
  2 Thread 32769 (LWP 28676)  0x420db1a7 in poll () from
/lib/i686/libc.so.6
  1 Thread 16384 (LWP 28653)  0x4005ba35 in __pthread_sigsuspend ()
   from /lib/i686/libpthread.so.0
\end{Code}

The asterisk means that you are currently in thread 4.  Let's see what's
going on with that thread:

\pagebreak

\vspace{6pt}
\begin{lstlisting}[frame=lines]
(gdb) bt
#0  0x4005ba35 in __pthread_sigsuspend () from /lib/i686/libpthread.so.0
#1  0x4005adb8 in __pthread_wait_for_restart_signal ()
   from /lib/i686/libpthread.so.0
#2  0x4005d190 in __pthread_alt_lock () from /lib/i686/libpthread.so.0
#3  0x40059d77 in pthread_mutex_lock () from /lib/i686/libpthread.so.0
#4  0x0804855f in worker (tn=1) at Primes.c:49
#5  0x40059881 in pthread_start_thread () from /lib/i686/libpthread.so.0
#6  0x40059985 in pthread_start_thread_event () from
/lib/i686/libpthread.so.0
\end{lstlisting}
\vspace{6pt}

(This works under the LinuxThreads implementation of Pthreads but may
not be possible on some other platforms.)

Aha---you see in frames 3 and 4 that this thread is on line 49 of the
source code and is trying to acquire the lock and enter the critical
section: 

\begin{Code}
pthread_mutex_lock(&nextbaselock);
\end{Code}

Note also from frame 0 above that the thread is apparently suspended
pending the lock's being relinquished by another thread. It will not get
any timeslices until this happens {\it and}\/ the thread manager
arranges for it to acquire the lock.

What are the other threads doing?  You can inspect any thread's stack
by switching to that thread and then issuing the {\tt bt} command:

\begin{Code}
(gdb) thread 3
[Switching to thread 3 (Thread 16386 (LWP 28677))]#0  0x4005ba35 in
__pthread_sigsuspend () from /lib/i686/libpthread.so.0
(gdb) bt
#0  0x4005ba35 in __pthread_sigsuspend () from /lib/i686/libpthread.so.0
#1  0x4005adb8 in __pthread_wait_for_restart_signal ()
   from /lib/i686/libpthread.so.0
#2  0x4005d190 in __pthread_alt_lock () from /lib/i686/libpthread.so.0
#3  0x40059d77 in pthread_mutex_lock () from /lib/i686/libpthread.so.0
#4  0x0804855f in worker (tn=0) at Primes.c:49
#5  0x40059881 in pthread_start_thread () from /lib/i686/libpthread.so.0
#6  0x40059985 in pthread_start_thread_event () from
/lib/i686/libpthread.so.0
\end{Code}

Recall that we created two worker threads.  You saw above that thread 4
was one of them (frame 4 from its {\tt bt} output), and now you see
from frame 4 of the output here that thread 3 is the other one.  You also
see that thread 3 is trying to acquire the lock as well (frame 3).

There shouldn't be any other worker threads, but one of the
fundamental principles of debugging is that nothing is taken on faith,
and everything must be checked. We do this now by inspecting the
status of the remaining threads.  You'll find that the other two threads
are nonworker threads, as \mbox{follows:}

\begin{Code}
(gdb) thread 2
[Switching to thread 2 (Thread 32769 (LWP 28676))]#0  0x420db1a7 in poll
()
   from /lib/i686/libc.so.6
(gdb) bt
#0  0x420db1a7 in poll () from /lib/i686/libc.so.6
#1  0x400589de in __pthread_manager () from /lib/i686/libpthread.so.0
#2  0x4005962b in __pthread_manager_event () from
/lib/i686/libpthread.so.0
\end{Code}

So thread 2 is the threads manager.  This is internal to the Pthreads
package.  It is certainly not a worker thread, partially confirming
our expectation that there are only two worker threads. Checking
thread 1,

\begin{Code}
(gdb) thread 1
[Switching to thread 1 (Thread 16384 (LWP 28653))]#0  0x4005ba35 in
__pthread_sigsuspend () from /lib/i686/libpthread.so.0
(gdb) bt
#0  0x4005ba35 in __pthread_sigsuspend () from /lib/i686/libpthread.so.0
#1  0x4005adb8 in __pthread_wait_for_restart_signal ()
   from /lib/i686/libpthread.so.0
#2  0x40058551 in pthread_join () from /lib/i686/libpthread.so.0
#3  0x080486aa in main (argc=3, argv=0xbfffe7b4) at Primes.c:83
#4  0x420158f7 in __libc_start_main () from /lib/i686/libc.so.6
\end{Code}

\setlength\parindent{0in}you find it executes {\tt main()} and can thus confirm
that there are only two worker threads.

\setlength\parindent{0.25in}However, both of the workers are stalled, each
waiting for the lock to be relinquished. No wonder the program is hanging! This
is enough to pinpoint the location and nature of the bug, and we quickly realize
that we forgot the call to the unlocking function.

\subsection{A Variation}
\label{skip11}

What if you hadn't realized the necessity of guarding the update of the
shared variable \texttt{nextbase} in the first place?  What would have
happened in the previous example if you'd left out \textit{both}\/ the
unlock and the lock operations?

A naive look at this question might lead to the guess that there would
have been no harm in terms of correct operation of the program (i.e.,
getting an accurate count of the number of primes), albeit possibly with
a slowdown due to duplicate work (i.e., using the same value of {\tt
base} more than once).  It would seem that some threads may duplicate 
the work of others, namely when two workers happen to grab the same
value of \texttt{nextbase} to initialize their local copies of
\texttt{base}. Some composite numbers might then end up being crossed
out twice, but the results (i.e., the count of the number of primes)
would still be correct. 

But let's take a closer look.  The statement

\begin{Code}
base = nextbase += 2;
\end{Code}

\setlength\parindent{0in}compiles to at least two machine language instructions.
For instance, using the GCC compiler on a Pentium machine running Linux, the C
statement above translates to the following assembly language instructions
(obtained by running GCC with the {\tt -S} option and then viewing the resulting
\emph{.s}\/ file):

\begin{Code}
addl $2, nextbase
movl nextbase, %eax
movl %eax, -8(%ebp)
\end{Code}
%stopzone

\setlength\parindent{0.25in}This code increments {\tt nextbase} by 2, then
copies the value of {\tt nextbase} to the register EAX, and finally, copies the
value of EAX to the place in the worker's stack where its local variable {\tt
base} is stored.

Suppose you have only two worker threads and the value of {\tt nextbase} is,
say, 9, and the currently running {\tt worker()} invocation's timeslice ends
just after it executes the machine instruction

\begin{Code}
addl $2, nextbase
\end{Code}

\setlength\parindent{0in}which sets the shared global variable {\tt nextbase} to
11.  Suppose the next time\-slice goes to another invocation of {\tt worker()},
which happens to be executing those same instructions.  The second worker now
increments {\tt nextbase} to 13, uses this to set its local variable
\texttt{base}, and starts to eliminate all multiples of 13.  Eventually,
the first invocation of {\tt worker()} will get another timeslice, and
it will then pick up where it left off, executing the machine
instructions

\begin{Code}
movl nextbase, %eax
movl %eax, -8(%ebp)
\end{Code}
%stopzone

\setlength\parindent{0.25in}Of course, the value of {\tt nextbase} is now 13.
The first worker thus sets the value of its local variable {\tt base} to 13 and
proceeds to eliminate multiples of this value, not the value 11 that it set
during its last timeslice. Neither worker does anything with the multiples of
11. You end up not only duplicating work unnecessarily, but also skipping
necessary work!

How might you discover such an error using GDB?  Presumably the
``symptom'' that surfaced was that the number of primes reported was too
large.  Thus you might suspect that values of {\tt base} are somehow
sometimes skipped.  To check this hypothesis, you could place a
breakpoint right after the line

\begin{Code}
base = nextbase += 2;
\end{Code}

By repeatedly issuing the GDB {\tt continue} ({\tt c}) command and
displaying the value of {\tt base},

\begin{Code}
(gdb) disp base
\end{Code}

\setlength\parindent{0in}you might eventually verify that a value of {\tt base}
is indeed skipped.

\setlength\parindent{0.25in}The key word here is {\it might}\/.  Recall our
earlier discussion that threaded programs run in a somewhat random manner.  In
the context here, it may be the case that on some runs of the program the bug
surfaces (i.e., too many primes are reported), but on other runs you may get
correct answers!

There is, unfortunately, no good solution to this problem.  Debugging threaded
code often requires extra patience and creativity.

\index{sample programs!threaded code|)}

\subsection{GDB Threads Command Summary}

\index{GDB (GNU Project Debugger)!command summary}
\index{commands!GDB}  

Here is a summary of the usage of GDB's thread-related commands:

\begin{itemize}

\item {\tt info threads} (Gives information on all current threads)

\item {\tt thread 3} (Changes to thread 3)

\item {\tt break 88 thread 3} (Stops execution when thread 3 reaches
source line~88)

\item \texttt{break 88 thread 3 if {\itshape x}=={\itshape y}} (Stops execution
when thread 3 reaches
source line 88 and the variables \emph{x}\/ and \emph{y}\/ are equal)

\end{itemize}

\subsection{Threads Commands in DDD}

\index{DDD (Data Display Debugger)!command summary}
\index{commands!DDD}  

In DDD, select \textbf{Status $|$ Threads}, and a window will pop up, displaying
all threads in the manner of GDB's {\tt info threads}, as seen in
Figure~\ref{fig00}.  You can click a thread to switch the debugger's focus to
it.

You will probably want to keep this pop-up window around, rather than
using it once and then closing it.  This way you don't have to keep
reopening it every time you want to see which thread is currently
running or switch to a different thread.


\begin{figure}[h]
\includegraphics[width=4.0in]{images/06-fig00}
\caption{Threads window}
\label{fig00}
\end{figure}


There appears to be no way to make a breakpoint thread-specific in DDD,
as you did with the GDB command {\tt break 88 thread 3} above.  Instead, you
issue such a command to GDB via the DDD Console.

\subsection{Threads Commands in Eclipse}

\index{Eclipse!command summary}
\index{commands!Eclipse}  

Note first that the default makefile created by Eclipse will not include
the {\tt -lpthread} command-line argument for GCC (nor will it include
the arguments for any other special libraries you need).  You can alter
the makefile directly if you wish, but it is easier to tell Eclipse to
do it for you.  While in the C/C++ perspective, right-click your
project name, and select \textbf{Properties}; point the triangle next to C/C++
Build downward; select \textbf{Settings $|$ Tool Settings}; point the triangle
next to GCC C Linker downward and select \textbf{Libraries $|$ Add}  (the latter
is the green plus sign icon); and fill in your library flags minus the {\tt -l}
(e.g., filling in {\tt m}  for {\tt -lm}).  Then build your project.

Recall from Chapter~\ref{chap:somepreliminaries} that Eclipse constantly
displays your thread list, as opposed to having to request it, as in DDD.
Moreover, you do not need to ask for a backtrace kind of operation as you do in
DDD; the call stack is shown in the thread list.  This is depicted in
Figure~\ref{figec1d}.  As above, we ran the program for a while then interrupted
it by clicking the Suspend icon to the right of \emph{Resume}\/.  The thread
list is in the Debug view, which normally is in the upper-left portion of the
screen but appears here in expanded form since we clicked Maximize in the Debug
tab.  (We can click Restore to return to the standard layout.)

\begin{sloppypar}
We see that thread 3 had been running at the time of the interruption; it
had received a SIGINT signal, which is the interruption ({\sc ctrl}-C) signal.
We see also that the associated system call had been invoked by \mbox{{\tt
pthread\_join()},} which in turn had been called by {\tt main()}.  From what
we've seen about this program earlier, we know that this indeed is the main
thread.
\end{sloppypar}

To view the information for another thread, we merely click the triangle
next to the thread to point it downward.  To change to another thread,
we click its entry in the list.


\begin{figure}[h]
\includegraphics[width=4.0in]{images/06-figec1}
\caption{Threads display in Eclipse}
\label{figec1d}
\end{figure}


We may wish to set a breakpoint that applies only to a specific thread.
To do so, we must first wait until the thread is created.  Then when
execution pauses via a previous setting of a breakpoint, or an
interruption as above, we right-click the breakpoint symbol in the
same manner as we would to make a breakpoint conditional, but this time,
select \textbf{Filtering}.  A pop-up window like the one in Figure~\ref{figec2d}
will appear.  We see that this breakpoint currently applies to all three
threads.  If we wish it to apply only to thread 2, for instance, we
would uncheck the boxes next to the entries for the other two threads.


\begin{figure}[h]
\includegraphics[width=4.0in]{images/06-figec2}
\caption{Setting a thread-specific breakpoint in Eclipse}
\label{figec2d}
\end{figure}

\index{multiprogramming techniques!threaded code|)}
\index{threads!multiprogramming techniques|)}  

\section{Debugging Parallel Applications}

\index{multiprogramming techniques!parallel applications|(}
\index{parallel applications, multiprogramming techniques|(}  

There are two main types of parallel programming architectures---shared memory
and message passing.

The term \emph{shared memory}\/\index{shared memory, defined} means exactly
that: Multiple CPUs all have
access to some common physical memory.  Code running on one CPU
communicates with code running on the others by reading from and
writing to this shared memory, much as threads in a multithreaded
application communicate with one another through a shared address
space.  (Indeed, threaded programming has become the standard way to
write application code for shared memory systems.)

By contrast, in a \emph{message passing}\/ environment,\index{message passing,
defined} code running on each
CPU can only access that CPU's local memory, and it communicates with the
others by sending strings of bytes called {\it messages}\/ over a
communication medium.  Typically this is some kind of network, running
either a general-purpose protocol like TCP/IP or a specialized
software infrastructure that is tailored to message-passing
applications.

\subsection{Message-Passing Systems}
\label{mpi}
 
\index{message-passing systems, multiprogramming techniques|(} 

We will discuss message passing first, using the popular Message Passing
Interface (MPI) package as an example.  We use the MPICH implementation
here, but the same principles apply to LAM and other MPI implementations.

Let us again consider a prime-number finding program:

\begin{Code}[numbers=left]
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
\end{Code}

As explained in the comments at the beginning of the program, here our
Sieve of Eratosthenes runs on three nodes of a parallel system and
works in a pipelined manner.  The first node starts with odd numbers
and removes all multiples of 3, passing on the remaining values; the
second node takes the output of the first and removes all multiples of
5; and the third node takes the output of the second, removes the
rest of the nonprimes, and reports the number of primes that are left.

Here the pipelining is achieved by having each node pass one number at
a time to the next.  (Much greater efficiency could be attained
by passing groups of numbers in each MPI message, thus reducing
communications overhead.)  When sending a number on to the next node,
a node sends a message of type \texttt{PIPE\_MSG}.  When a node has no
more numbers to send, it indicates this by sending a message of type
\texttt{END\_MSG}.  

As a debugging example here, suppose we forget to include the latter
notification at the first node---that is, we forget line~46 in the code
for \texttt{node0()}:

\begin{Code}
MPI_Send(&dummy,1,MPI_INT,1,END_MSG,MPI_COMM_WORLD);
\end{Code}

The program will hang at the ``downstream'' nodes.  Let's see how we
can track down this bug.  (Keep in mind that some line numbers in the
GDB session below will differ by 1 from those in the above listing.)

You run an MPICH application program by invoking a script named {\tt
mpirun} on one node of the system.  The script then starts the
application program at each node, via SSH.  Here we did this on a
network of three machines, which we'll call Node 0, Node 1, and Node
2, with {\tt n} equal to 100.  The bug causes the program to hang at
the latter two nodes.  The program also hangs at the first node,
because no instance of an MPI program will exit until all have
executed the {\tt MPI\_FINALIZE()} function.

We would like to use GDB, but because we used {\tt mpirun} to invoke
the application at each of the three nodes, rather than running them
directly on the nodes, we cannot run GDB directly.  However,
GDB allows you to dynamically {\it attach}\/ the debugger to an
already-running process, using the process number.  So let's run {\tt
ps} on Node 1 to determine the number of the process that is
executing our application there:

\begin{Code}
$ ps ax 
...
 2755 ?        S      0:00 tcsh -c /home/matloff/primepipe node 1 3
 2776 ?        S      0:00 /home/matloff/primepipe node1 32812   4
 2777 ?        S      0:00 /home/matloff/primepipe node1 32812   4
\end{Code}

The MPI program is running as process 2776, so we attach GDB to
the program at Node 1:

\begin{Code}
$ gdb primepipe 2776
...
0xffffe002 in ?? ()
\end{Code}

This is not very informative!  So, let's see where we are:

\begin{Code}
(gdb) bt
#0  0xffffe002 in ?? ()
#1  0x08074a76 in recv_message ()
#2  0x080748ad in p4_recv ()
#3  0x0807ab46 in MPID_CH_Check_incoming ()
#4  0x08076ae9 in MPID_RecvComplete ()
#5  0x0806765f in MPID_RecvDatatype ()
#6  0x0804a29f in PMPI_Recv ()
#7  0x08049ce8 in node1 () at PrimePipe.c:56
#8  0x08049e19 in main (argc=8, argv=0xbffffb24) at PrimePipe.c:94
#9  0x420156a4 in __libc_start_main () from /lib/tls/libc.so.6
\end{Code}

We see from frame 7 that the program is hanging at line 56, waiting to
receive from Node 0.

Next, it would be useful to know how much work has been done by the
function running at Node 1, {\tt node1()}.  Has it just started, or
is it almost done?  We can gauge the progress by determining the last
value processed for the variable \texttt{tocheck}:

\begin{Code}
(gdb) frame 7
#7  0x08049ce8 in node1 () at PrimePipe.c:56
56          MPI_Recv(&tocheck,1,MPI_INT,0,MPI_ANY_TAG,
(gdb) p tocheck
$1 = 97
\end{Code}
%stopzone

\begin{note}
We needed to move to the stack frame for \texttt{\itshape node1()}
first, using GDB's \texttt{\itshape frame} command.
\end{note}

This indicates that Node 1 is at the end of execution, as 97 should be
the last number that Node 0 passes to it for prime checking.  So,
currently we would be expecting a message from Node 0 of type END\_MSG.
The fact that the program is hanging would suggest that Node 0
might not have sent such a message, which would in turn lead us to check
whether it had.  In this manner, we hopefully would zero in quickly on
the bug, which was the accidental omission of line 46.

By the way, keep in mind that when GDB is invoked with the command

\begin{Code}
$ gdb primepipe 2776
\end{Code}

\setlength\parindent{0in}as we did above, GDB's command-line processing first
checks for a core file named \emph{2776}\/.  In the unlikely event that such a
file exists, GDB will load it instead of attaching to the intended
process. Alternatively, GDB also has an {\tt attach} command. 

\setlength\parindent{0.25in}In this example, the bug caused the program to hang.
 The approach to debugging a parallel program like this one is somewhat
different when the symptom is incorrect output.  Suppose, for example, that in
line 71 we incorrectly initialized {\tt primecount} to 2 instead of 3.  If
we try to follow the same debugging procedure, the programs running on
each node would finish execution and exit too quickly for you to attach
GDB.  (True, we could use a very large value of {\tt n}, but it is
usually better to debug with simple cases at first.)  We need some
device that can be used to make the programs wait and give you a chance
to attach GDB.  This is the purpose of line 34 in the \texttt{init()}
function.

As can be seen in the source code, the value of {\tt debugwait} is
taken from the command line supplied by the user, with 1 meaning wait
and 0 meaning no wait.  If we specify 1 for the value of {\tt
debugwait}, then when each invocation of the program reaches line 34,
it remains there. This gives us time to attach GDB.  We can then break
out of the infinite loop and proceed to debug. Here is what we do at
Node 0:

\begin{Code}
node1:~$ gdb primepipe 3124
...
0x08049c53 in init (argc=3, argv=0xbfffe2f4) at PrimePipe.c:34
34         while (debugwait) ;
(gdb) set debugwait = 0
(gdb) c
Continuing.
\end{Code}
%stopzone

Ordinarily, we dread infinite loops, but here we deliberately set one
up in order to facilitate debugging. We do the same thing at Node 1 and 
Node 2, and at the latter we also take the opportunity to set a breakpoint 
at line 77 before continuing:

\begin{Code}
[matloff@node3 ~]$ gdb primepipe 2944
34         while (debugwait) ;
(gdb) b 77
Breakpoint 1 at 0x8049d7d: file PrimePipe.c, line 77.
(gdb) set debugwait = 0
(gdb) c
Continuing.

Breakpoint 1, node2 () at PrimePipe.c:77
77            if (status.MPI_TAG == END_MSG) break;
(gdb) p tocheck
$1 = 7
(gdb) n
78            iscomposite = 0;
(gdb) n
79            for (i = 7; i*i <= tocheck; i += 2)
(gdb) n
84            if (!iscomposite) primecount++;  
(gdb) n
75            MPI_Recv(&tocheck,1,MPI_INT,1,MPI_ANY_TAG,
(gdb) p primecount
$2 = 3
\end{Code}
%stopzone

At this point, we notice that {\tt primecount} should be 4, not
3---the primes through 7 are 2, 3, 5, and 7---and thus we have found the
location of the bug.

\index{message-passing systems, multiprogramming techniques|)} 

\subsection{Shared-Memory Systems}

\index{shared-memory systems!multiprogramming techniques} 

Now, what about the shared-memory type of parallel programming?  Here we
have separate cases for true shared-memory machines and software-distributed 
shared-memory settings.

\subsubsection{True Shared Memory}

As mentioned earlier, in a true shared-memory environment, application
programs are often developed using threads. Our material in
Section~\ref{debugthreaded} on debugging with GDB/DDD then applies.

\begin{sloppypar}
OpenMP has become a popular programming environment on such
machines.\index{OpenMP!true shared memory} 
OpenMP supplies the programmer with high-level parallel programming
constructs, which in turn make use of threads.  The programmer still
has thread-level access if needed, but for the most part the threaded
implementation of the OpenMP directives is largely transparent to the
\mbox{programmer.}

We present an extended example in Section~\ref{extended} of debugging
an \mbox{OpenMP application.}
\end{sloppypar}


\subsubsection{Software Distributed Shared-Memory Systems}

Prices of machines with dual-core CPUs are now within reach of ordinary
consumers, but large-scale shared-memory systems with many processors still cost
hundreds of thousands of dollars.  A popular,
inexpensive alternative is a \textit{network of workstations (NOW)}\/.\index{NOW
architectures!libraries}\index{libraries!NOW architectures} NOW
architectures use an underlying library that gives the illusion of shared
memory. The library, which is largely transparent to
the application programmer, engages in network transactions that maintain
consistency of copies of shared variables across the different nodes.

This approach is called \textit{software distributed shared memory
(SDSM)}\/.\index{SDSM (software distributed shared memory), libraries}
\index{software distributed shared memory (SDSM), libraries}
\index{libraries!SDSM}  
The most widely used SDSM library is Treadmarks, developed and maintained by
Rice University.  Another excellent package is JIAJIA, available from the
Chinese Academy of Sciences
(\emph{http://www-users.cs.umn.edu/\~\/tianhe/paper/dist.htm}\/).

SDSM applications exhibit certain kinds of behavior that may baffle
the unwary programmer.  These are highly dependent on the particular
system, so a general treatment cannot be given here, but we will
briefly discuss a few issues common to many of them.

Many SDSMs are {\it page based}\/, meaning that they rely on the
underlying virtual memory hardware at the nodes.\index{pages!SDMS systems}  The
actions are
complex, but we can give a quick overview. Consider a variable {\tt X}
that is to be shared among the NOW nodes.  The programmer indicates
this intention by making a certain call to the SDSM library, which in
turn makes a certain Unix system call requesting the OS to replace its
own seg fault handler with a function in the SDSM library for page
faults involving the page containing {\tt X}.  The SDSM sets things up
in such a way that only NOW nodes with valid copies of {\tt X} have
the corresponding memory pages marked as resident.  When {\tt X} is
accessed at some other node, a page fault results, and the underlying
SDSM software fetches the correct value from a node that has it.

Again, it's not essential to know the precise workings of the SDSM
system; rather, the important thing is to simply understand that there
\textit{is}\/ an underlying VM-based mechanism that's being used to
maintain consistency of local copies of shared data across the NOW
nodes. If you don't, you will be mystified when you try to debug SDSM
application code. The debugger will \textit{seem}\/ to mysteriously stop
for nonexistent seg faults, because the SDSM infrastructure
deliberately generates seg faults, and when an SDSM application
program is run under a debugging tool, the tool senses them. Once you
realize this, there is no problem at all---in GDB, you'd merely issue
a {\tt continue} command to resume execution when one of these odd
pauses occurs.

You may be tempted to order GDB not to stop or issue warning
messages whenever any seg faults occur, using the GDB command

\begin{Code}
handle SIGSEGV nostop noprint
\end{Code}

You should use this approach with caution, though, as it may result in your
missing any genuine seg faults caused by bugs in the application
\mbox{program.}

Yet another, related difficulty with debugging applications that run
on page-based SDSMs arises as follows.  If a node on the network
changes the value of a shared variable, then any other node that needs
the value of that variable must obtain the updated value through a
network transaction.  Once again, the details of how this happens
depends on the SDSM system, but this means that if you are
single-stepping through the code executing on one node, you may find
that GDB mysteriously hangs because the node is now waiting for an
update to its local copy of a variable that was recently modified by
another node.  If you happen to be running a separate GDB session
to step through the code on that other node as well, the update will
not occur on the first node until the debugging session on the second
node progresses far enough.  In other words, if the programmer is not
alert and careful during the debugging of an SDSM application, he can
cause his own deadlock situation through the debugging process itself.

The SDSM situation is similar to that of the message-passing case in one
sense---the need to have a variable like {\tt debugwait} in the MPI
example above, which allows you to have the program pause at all nodes,
giving you a chance to attach GDB at each node and step through the
program from the \mbox{beginning.}

\index{multiprogramming techniques!parallel applications|)}
\index{parallel applications, multiprogramming techniques|)}  


\section{Extended Example}
\label{extended}

\index{multiprogramming techniques!example|(}
\index{sample programs!seg faults|(}
\index{shared-memory systems!example|(}
\index{OpenMP!example|(}

This section presents an example of debugging a shared-memory
application developed using OpenMP.  The necessary knowledge of OpenMP
will be explained below.  All that is needed is a basic understanding
of threads.

\subsection{OpenMP Overview}

OpenMP is essentially a higher-level parallel programming interface to
thread-management operations.  The number of threads is set via the
environment variable \texttt{OMP\_NUM\_THREADS}.  In the C shell, for
instance, you type

\pagebreak

\vspace{6pt}
\begin{lstlisting}[frame=lines]
% setenv OMP_NUM_THREADS 4
\end{lstlisting}
\vspace{6pt}

\setlength\parindent{0in}at the shell prompt to arrange to have four threads.

\setlength\parindent{0.25in}Application code consists of C interspersed with
OpenMP directives.  Each directive applies to the block that follows it,
delimited by left and right braces.  The most basic directive is

\begin{Code}
#pragma omp parallel  
\end{Code}

This sets up \texttt{OMP\_NUM\_THREADS} threads, each of which
concurrently executes the block of code following the pragma.  There
will typically be other directives embedded within this block.

Another very common OpenMP directive is

\begin{Code}
#pragma omp barrier  
\end{Code}

This specifies a ``meeting point'' for all the threads.  When any
thread reaches this point, it will block until all the other threads
have arrived there.

You may often wish to have just one thread execute a certain block, while the
other threads skip it.  This is accomplished by writing

\begin{Code}
#pragma omp single
\end{Code}

There is an implied barrier immediately following such a block.  

There are many other OpenMP directives, but the only other one used
in the example here is

\begin{Code}
#pragma omp critical  
\end{Code}

As the name implies, this creates a critical section, in which only one
thread is allowed at any given time.

\subsection{OpenMP Example Program}

We implement the famous Dijkstra algorithm for determining minimum
distances between pairs of vertices in a weighted graph.\index{Dijkstra
algorithm}  Say we are given
distances between adjacent vertices (if two vertices are not adjacent, the
distance between them is set to infinity).  The goal is to find the
minimum distances between vertex 0 and all other vertices.

Following is the source file, \emph{dijkstra.c}\/.  It generates random
edge lengths among a specified number of vertices and then finds the
minimum distances from vertex 0 to each of the other vertices.

\begin{Code}[numbers=left]
// dijkstra.c

// OpenMP example program:  Dijkstra shortest-path finder in a
// bidirectional graph; finds the shortest path from vertex 0 to all
// others

// usage:  dijkstra nv print

// where nv is the size of the graph, and print is 1 if graph and min
// distances are to be printed out, 0 otherwise

#include <omp.h>  // required
#include <values.h>  

// including stdlib.h and stdio.h seems to cause a conflict with the
// Omni compiler, so declare directly
extern void *malloc();
extern int printf(char *,...);

// global variables, shared by all threads 
int nv,  // number of vertices
    *notdone, // vertices not checked yet
    nth,  // number of threads
    chunk,  // number of vertices handled by each thread
    md,  // current min over all threads
    mv;  // vertex which achieves that min

int *ohd,  // 1-hop distances between vertices; "ohd[i][j]" is
           // ohd[i*nv+j]
    *mind;  // min distances found so far

void init(int ac, char **av)
{  int i,j,tmp;
   nv = atoi(av[1]);
   ohd = malloc(nv*nv*sizeof(int));
   mind = malloc(nv*sizeof(int));
   notdone = malloc(nv*sizeof(int)); 
   // random graph
   for (i = 0; i < nv; i++)  
      for (j = i; j < nv; j++)  {
         if (j == i) ohd[i*nv+i] = 0;
         else  {
            ohd[nv*i+j] = rand() % 20;
            ohd[nv*j+i] = ohd[nv*i+j];
         }
      }
   for (i = 1; i < nv; i++)  {
      notdone[i] = 1;
      mind[i] = ohd[i];
   }
}

// finds closest to 0 among notdone, among s through e; returns min
// distance in *d, closest vertex in *v
void findmymin(int s, int e, int *d, int *v)
{  int i;
   *d = MAXINT; 
   for (i = s; i <= e; i++)
      if (notdone[i] && mind[i] < *d)  {
         *d = mind[i];
         *v = i;
      }
}

// for each i in {s,...,e}, ask whether a shorter path to i exists, through
// mv
void updatemind(int s, int e)
{  int i;
   for (i = s; i <= e; i++)
      if (notdone[i])
         if (mind[mv] + ohd[mv*nv+i] < mind[i])  
            mind[i] = mind[mv] + ohd[mv*nv+i];
}

void dowork()
{  
   #pragma omp parallel  
   {  int startv,endv,  // start, end vertices for this thread
          step,  // whole procedure goes nv steps
          mymv,  // vertex which attains that value
          me = omp_get_thread_num(),  
          mymd;  // min value found by this thread
      #pragma omp single   
      {  nth = omp_get_num_threads();  chunk = nv/nth;  
         printf("there are %d threads\n",nth);  }
      startv = me * chunk; 
      endv = startv + chunk - 1;
      // the algorithm goes through nv iterations
      for (step = 0; step < nv; step++)  {
         // find closest vertex to 0 among notdone; each thread finds
         // closest in its group, then we find overall closest
         #pragma omp single 
         {  md = MAXINT; 
            mv = 0;  
         }
         findmymin(startv,endv,&mymd,&mymv);
         // update overall min if mine is smaller
         #pragma omp critical  
         {  if (mymd < md)  
              {  md = mymd;  }
         }
         #pragma omp barrier 
         // mark new vertex as done 
         #pragma omp single 
         {  notdone[mv] = 0;  }
         // now update my section of ohd
         updatemind(startv,endv);
      }
   }
}

int main(int argc, char **argv)
{  int i,j,print;
   init(argc,argv);
   // start parallel
   dowork();  
   // back to single thread
   print = atoi(argv[2]);
   if (print)  {
      printf("graph weights:\n");
      for (i = 0; i < nv; i++)  {
         for (j = 0; j < nv; j++)  
            printf("%u  ",ohd[nv*i+j]);
         printf("\n");
      }
      printf("minimum distances:\n");
      for (i = 1; i < nv; i++)
         printf("%u\n",mind[i]);
   }
}
\end{Code}

Let's review how the algorithm works.  Start with all vertices
except vertex 0, which in this case are vertices 1 through 5, in a ``not
done'' set.  In each iteration of the algorithm, do the following:

\begin{enumerate}

\item Find the ``not done'' vertex {\tt v} that is closest to
vertex 0, along paths known so far.  This checking is shared by all
the threads, with each thread checking an equal number of vertices.
The function that does this work is {\tt findmymin()}.

\item Then move {\tt v} to the ``done'' set.  

\item For all remaining vertices {\tt i} in the ``not done'' set, 
check whether going first from 0 to {\tt v} along the best known
path so far, and then from {\tt v} to {\tt i} in one hop, is shorter
than the current shortest distance from 0 to {\tt i}.  If so,
update that distance accordingly.  The function that performs these
actions is {\tt updatemind()}.

\end{enumerate}

The iteration continues until the ``not done'' set is empty.

Since OpenMP directives require preprocessing, there is always the
potential problem that we will lose our original line numbers and
variable and function names.  To see how to address this, we will
discuss two different compilers.  First we'll look at the Omni compiler
(\emph{http://www.hpcc.jp/Omni/}\/), and then at GCC (version 4.2 or later
is required).

We compile our code under Omni as follows:

\begin{Code}
$ omcc -g -o dij dijkstra.c
\end{Code}

After compiling the program and running it with four threads, we find
that it fails to work properly:

\begin{Code}
$ dij 6 1
there are 4 threads
graph weights:
0  3  6  17  15  13
3  0  15  6  12  9
6  15  0  1  2  7
17  6  1  0  10  19
15  12  2  10  0  3
13  9  7  19  3  0
minimum distances:
3
6
17
15
13
\end{Code}

Analyzing the graph by hand shows that the correct minimum distances
should be 3, 6, 7, 8, and 11.

Next, we run the program in GDB. Here it is very important to
understand the consequences of the fact that OpenMP works via
directives.  Although line numbers, function names, and so on are
mostly retained by the two compilers discussed here, there are some
discrepancies between them.  Look at what happens when we try to set a
breakpoint in the executable, {\tt dij}, at the outset of the GDB
session:

\begin{Code}
(gdb) tb main
Breakpoint 1 at 0x80492af
(gdb) r 6 1
Starting program: /debug/dij 6 1
[Thread debugging using libthread_db enabled]
[New Thread -1208490304 (LWP 11580)]
[Switching to Thread -1208490304 (LWP 11580)]
0x080492af in main ()
(gdb) l
1       /tmp/omni_C_11486.c: No such file or directory.
        in /tmp/omni_C_11486.c
\end{Code}

We discover that the breakpoint is not in the source file.  Instead, it
is in Omni's OpenMP infrastructure code.  In other words, {\tt main()}
here is Omni's {\tt main()}, not your own.  The Omni compiler mangled the
name of our {\tt main()} to {\tt \_ompc\_main()}.  

To set a breakpoint at {\tt main()}, we type

\begin{Code}
(gdb) tb _ompc_main
Breakpoint 2 at 0x80491b3: file dijkstra.c, line 114.
\end{Code}

\setlength\parindent{0in}and check it by continuing:

\begin{Code}
(gdb) c
Continuing.
[New Thread -1208493152 (LWP 11614)]
[New Thread -1218983008 (LWP 11615)]
[New Thread -1229472864 (LWP 11616)]
_ompc_main (argc=3, argv=0xbfab6314) at dijkstra.c:114
114        init(argc,argv);
\end{Code}

\setlength\parindent{0.25in}Okay, there's the familiar {\tt init()} line.  Of
course, we could have issued the command

\begin{Code}
(gdb) b dijkstra.c:114
\end{Code}

Note the creation of the three new threads, making four in all.

However we choose to set our breakpoints, we must do a bit more
work here than normal, so it's particularly important to stay within a single
GDB session between runs of the program, even when we change our
source code and recompile, so that we retain the breakpoints,
conditions, and so on.  That way we only have to go to the trouble of
setting these things up once.

Now, how do you track down the bug(s)?  It is natural to approach the
debugging of this program by checking the results at the end of each
iteration.  The main results are in the ``not done'' set (in the
array {\tt notdone[]}) and in the current list of best-known distances
from 0 to the other vertices, that is, the array {\tt mind[]}.  For
example, after the first iteration, the ``not done'' set should consist
of vertices 2, 3, 4, and 5, vertex 1 having been selected in that
iteration.

Armed with this information, let's apply the Principle of
Confirmation and check {\tt notdone[]} and {\tt mind[]} after each
iteration of the {\tt for} loop in {\tt dowork()}.

We have to be careful as to exactly where we set our breakpoints.
Although a natural spot for this seems to be line 108, at the very end
of the algorithm's main loop, this may not be so good, as GDB will
stop there for {\it each}\/ thread.  Instead, opt for placing a
breakpoint inside an OpenMP {\tt single} block, so that it will stop for
only one thread.

So, instead we check the results after each iteration by stopping
at the {\it beginning}\/ of the loop, starting with the second
iteration:

\begin{Code}
(gdb) b 92 if step >= 1
Breakpoint 3 at 0x80490e3: file dijkstra.c, line 92.
(gdb) c
Continuing.
there are 4 threads

Breakpoint 3, __ompc_func_0 () at dijkstra.c:93
93               {  md = MAXINT;
\end{Code}

Let's confirm that the first iteration did choose the correct vertex
(vertex 1) to be moved out of the ``not done'' set:

\begin{Code}
(gdb) p mv
$1 = 0
\end{Code}

The hypothesis is not confirmed, after all.  Inspection of the code
shows that on line~100 we forgot to set {\tt mv}.  We fix it to read

\begin{Code}
{  md = mymd; mv = mymv;  }
\end{Code}

So, we recompile and run the program again.  As noted earlier in this
section (and elsewhere in this book), it is very helpful to not exit GDB
when you rerun the program.  We could run the program in another terminal
window, but just for variety let's take a different approach here.
We temporarily disable our breakpoints by issuing the {\tt dis}
command, then run the recompiled program from within GDB, and then
re-enable the breakpoints using {\tt ena}:

\begin{Code}
(gdb) dis
(gdb) r
The program being debugged has been started already.
Start it from the beginning? (y or n) y
`/debug/dij' has changed; re-reading symbols.
Starting program: /debug/dij 6 1
[Thread debugging using libthread_db enabled]
[New Thread -1209026880 (LWP 11712)]
[New Thread -1209029728 (LWP 11740)]
[New Thread -1219519584 (LWP 11741)]
[New Thread -1230009440 (LWP 11742)]
there are 4 threads
graph weights:
0  3  6  17  15  13
3  0  15  6  12  9
6  15  0  1  2  7
17  6  1  0  10  19
15  12  2  10  0  3
13  9  7  19  3  0
minimum distances:
3
6
17
15
13

Program exited with code 06.
(gdb) ena
\end{Code}

We're still getting wrong answers.  Let's check things at that
breakpoint again:

\begin{Code}
(gdb) r
Starting program: /debug/dij 6 1
[Thread debugging using libthread_db enabled]
[New Thread -1209014592 (LWP 11744)]
[New Thread -1209017440 (LWP 11772)]
[New Thread -1219507296 (LWP 11773)]
[New Thread -1229997152 (LWP 11774)]
there are 4 threads
[Switching to Thread -1209014592 (LWP 11744)]

Breakpoint 3, __ompc_func_0 () at dijkstra.c:93
93               {  md = MAXINT;
(gdb) p mv
$2 = 1
\end{Code}

At least {\tt mv} now has the right value.  Let's check {\tt mind[]}:

\begin{Code}
(gdb) p *mind@6
$3 = {0, 3, 6, 17, 15, 13}
\end{Code}

Note that because we constructed the {\tt mind[]} array dynamically
via \malloc, we could not use GDB's {\tt print} command in its
usual form.  Instead, we used GDB's artificial array feature.

At any rate, {\tt mind[]} is still incorrect.  For instance, {\tt
mind[3]} should be 3 + 6 = 9, yet it is 17.  Let's check the code that
updates {\tt mind[]}:

\begin{Code}
(gdb) b 107 if me == 1
Breakpoint 4 at 0x8049176: file dijkstra.c, line 107.
(gdb) r
The program being debugged has been started already.
Start it from the beginning? (y or n) y
Starting program: /debug/dij 6 1
[Thread debugging using libthread_db enabled]
[New Thread -1209039168 (LWP 11779)]
[New Thread -1209042016 (LWP 11807)]
[New Thread -1219531872 (LWP 11808)]
[New Thread -1230021728 (LWP 11809)]
there are 4 threads
[Switching to Thread -1230021728 (LWP 11809)]

Breakpoint 4, __ompc_func_0 () at dijkstra.c:107
107              updatemind(startv,endv);
\end{Code}

First, confirm that {\tt startv} and {\tt endv} have sensible
values:

\begin{Code}
(gdb) p startv
$4 = 1
(gdb) p endv
$5 = 1
\end{Code}

The chunk size is only 1?  Let's see:

\begin{Code}
(gdb) p chunk
$6 = 1
\end{Code}

After checking the computation for {\tt chunk}, we realize that we need
the number of threads to evenly divide {\tt nv}.  The latter has the
value 6, which is not divisible by our thread count, 4.  We make a note
to ourselves to insert some error-catching code later, and reduce our 
thread count to 3 for now.

Once again, we do not want to exit GDB to do this.  GDB inherits the
environment variables when it is first invoked, but the values of those
variables can also be changed or set within GDB, and that is what we do
here:

\begin{Code}
(gdb) set environment OMP_NUM_THREADS = 3
\end{Code}

Now let's run again:

\begin{Code}
(gdb) dis
(gdb) r
The program being debugged has been started already.
Start it from the beginning? (y or n) y
Starting program: /debug/dij 6 1
[Thread debugging using libthread_db enabled]
[New Thread -1208707392 (LWP 11819)]
[New Thread -1208710240 (LWP 11847)]
[New Thread -1219200096 (LWP 11848)]
there are 3 threads
graph weights:
0  3  6  17  15  13
3  0  15  6  12  9
6  15  0  1  2  7
17  6  1  0  10  19
15  12  2  10  0  3
13  9  7  19  3  0
minimum distances:
3
6
7
15
12

Program exited with code 06.
(gdb) ena
\end{Code}

Aiyah, still the same wrong answers!  We continue to check the
updating process for {\tt mind[]}:

\begin{Code}
(gdb) r
Starting program: /debug/dij 6 1
[Thread debugging using libthread_db enabled]
[New Thread -1208113472 (LWP 11851)]
[New Thread -1208116320 (LWP 11879)]
[New Thread -1218606176 (LWP 11880)]
there are 3 threads
[Switching to Thread -1218606176 (LWP 11880)]

Breakpoint 4, __ompc_func_0 () at dijkstra.c:107
107              updatemind(startv,endv);
(gdb) p startv
$7 = 2
(gdb) p endv
$8 = 3
\end{Code}

All right, those are the correct values for {\tt startv} and {\tt endv}
in the case of {\tt me = 1}.  So, we enter the function:

\begin{Code}
(gdb) s
[Switching to Thread -1208113472 (LWP 11851)]

Breakpoint 3, __ompc_func_0 () at dijkstra.c:93
93               {  md = MAXINT;
(gdb) c
Continuing.
[Switching to Thread -1218606176 (LWP 11880)]
updatemind (s=2, e=3) at dijkstra.c:69
69         for (i = s; i <= e; i++)
\end{Code}

Note that due to context switches among the threads, we did not enter
{\tt updatemind()} immediately.  Now we check the case {\tt i
= 3}:

\begin{Code}
(gdb) tb 71 if i == 3
Breakpoint 5 at 0x8048fb2: file dijkstra.c, line 71.
(gdb) c
Continuing.
updatemind (s=2, e=3) at dijkstra.c:71
71               if (mind[mv] + ohd[mv*nv+i] < mind[i])
\end{Code}

As usual, we apply the Principle of Confirmation:

\begin{Code}
(gdb) p mv
$9 = 0
\end{Code}

Well, that's a big problem.  Recall that in the first iteration, {\tt mv}
turns out to be 1. Why is it 0 here?

After a while we realize that those context switches should have been a
big hint.  Take a look at the GDB output above again.  The thread
whose system ID is 11851 was already on line 93---in other words, it was
already in the next iteration of the algorithm's main loop.  In fact,
when we hit {\tt c} to continue, it even executed line 94, which is

\begin{Code}
mv = 0;
\end{Code}

This thread overwrote {\tt mv}'s previous value of 1, so that the thread
that updates {\tt mind[3]} is now relying on the wrong value of {\tt mv}.
The solution is to add another barrier:

\begin{Code}
updatemind(startv,endv);
#pragma omp barrier
\end{Code}

After this fix, the program runs correctly.

The foregoing was based on the Omni compiler.  As mentioned, beginning
with version 4.2, GCC handles OpenMP code as well.  All you have to do
is add the {\tt -fopenmp} flag to the GCC command line.

Unlike Omni, GCC generates code in such a way that GDB's focus is in
your own source file from the beginning.  Thus, issuing a command

\begin{Code}
(gdb) b main
\end{Code}

\setlength\parindent{0in}at the very outset of a GDB session really will cause a
breakpoint to be set in one's own {\tt main()}, unlike what we saw for the Omni
compiler.

\setlength\parindent{0.25in}However, at this writing, a major shortcoming of GCC
is that the symbols for local variables that are inside an OpenMP {\tt parallel}
block (called {\it private}\/ variables in OpenMP terminology) will not be
visible within GDB.  For example, the command

\begin{Code}
(gdb) p mv
\end{Code}

\setlength\parindent{0in}that you issued for the Omni-generated code above will
work for GCC-generated code, but the command

\begin{Code}
(gdb) p startv
\end{Code}

will fail on GCC-generated code.  

\setlength\parindent{0.25in}There are ways to work around this, of course.  For
instance, if you wish to know the value of {\tt startv}, you can query the value
of {\tt s} within {\tt updatemind()}.  Hopefully this issue will be resolved
in the next version of GCC.

\index{multiprogramming techniques|)} 
\index{multiprogramming techniques!example|)}
\index{sample programs!seg faults|)}
\index{shared-memory systems!example|)}
\index{OpenMP!example|)}

