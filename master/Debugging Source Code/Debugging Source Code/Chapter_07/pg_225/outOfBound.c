#include <malloc.h>
#include <stdio.h>



int main( void )
{
	int *a = (int *) malloc( 2*sizeof(int) );

	for( int i = 0; i <= 2; ++i ) {
		a[i] = i;
		printf("%d\n", a[i]);
	}

	free(a);
	return 0;
}
