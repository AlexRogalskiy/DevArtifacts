#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <math.h>


int main( void )
{
	double trouble = exp(1000.0);
	if ( errno ) {
		printf("trouble: %f (errno: %d)\n", trouble, errno);
		exit(EXIT_FAILURE);
	}

	return 0;
}
