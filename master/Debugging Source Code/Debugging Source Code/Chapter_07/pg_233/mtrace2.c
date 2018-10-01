#include <malloc.h>
#include <mcheck.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>

void sigsegv_handler(int signum);



int main( void )
{
	int *p;

	signal(SIGSEGV, sigsegv_handler);
	mtrace();
	p = (int *) malloc( sizeof(int) );

	raise(SIGSEGV);
	return 0;
}



void sigsegv_handler(int signum)
{
	printf("I caught sigsegv: signal %d.  Shutting down gracefully.\n", signum);
	muntrace();
	abort();
}
