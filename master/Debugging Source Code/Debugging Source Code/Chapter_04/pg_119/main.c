#include <stdio.h>
#include <stdlib.h>

int q[200];

int main( void )
{
	int i, n, *p;
	p = malloc(sizeof(int));
	scanf("%d", &n);
	for( i = 0; i < 200; ++i )
		q[i] = i;

	printf("%x %x %x %x %x\n", main, q, p, &i, scanf);

	return 0;
}
