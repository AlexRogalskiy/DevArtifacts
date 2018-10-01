#include <mcheck.h>
#include <malloc.h>
#include <stdio.h>



int main( void )
{
	int *p, *q;

	mtrace();
	p = (int *) malloc( sizeof(int) );

	printf("p points to %p\n", p);
	printf("q points to %p\n", q);

	free(q);

	return 0;
}
