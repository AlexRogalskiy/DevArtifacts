#include <mcheck.h>
#include <malloc.h>
#include <stdio.h>



int main( void )
{
	mcheck(NULL);

	int *p = (int *) malloc( sizeof(int) );
	p[1] = 0;

	free(p);

	return 0;
}
