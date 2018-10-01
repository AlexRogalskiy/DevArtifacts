#include <stdio.h>
int main( int argc, char **argv )
{
	int i;
	int j;
	
	i = argc;
	j = **argv;
	
	if( i == 2 )
	{
		++j;
	}
	else
	{
		--j;
	}
	
	printf( "i=%d, j=%d\n", i, j );
	return 0;
}