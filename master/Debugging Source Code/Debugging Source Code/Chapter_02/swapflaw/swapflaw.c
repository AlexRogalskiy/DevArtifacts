/* swapflaw.c: A flawed function that swaps wo integers. */
#include <stdio.h>
void swap(int a, int b);

int main( void )
{
	int i = 4;
	int j = 6;

	printf("i: %d, j: %d\n", i, j);
	swap(i, j);
	printf("i: %d, j: %d\n", i, j);

	return 0;
}

void swap(int a, int b)
{
	int c = a;
	a = b;
	b = c;
}
