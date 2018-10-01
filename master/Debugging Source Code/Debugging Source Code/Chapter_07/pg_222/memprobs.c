#include <malloc.h>
#include <stdio.h>



int main( void )
{
	int *a = (int *) malloc( 3*sizeof(int) ); // malloc return not checked
	int *b = (int *) malloc( 3*sizeof(int) ); // malloc return not checked

	for( int i = -1; i <= 3; ++i )
		a[i] = i; // a bad write for i = -1 and 3.

	free(a);
	printf("%d\n", a[1]); // a read from freed memory
	free(a); // a double free on pointer a.

	return 0; // program ends without freeing *b.
}
