#include <malloc.h>
#include <stdio.h>
extern int EF_PROTECT_BELOW;



int main( void )
{
	// Try commenting/uncommenting the line below and see if it make sense.
	EF_PROTECT_BELOW = 1;

	int *a = (int *) malloc( 2*sizeof(int) );

	for( int i = -2; i < 2; ++i ) {
		a[i] = i;
		printf("%d\n", a[i]);
	}

	free(a);
	return 0;
}
