#include <stdio.h>



int main( void )
{
	FILE *fp;

	fp = fopen("/foo/bar", "r");

	if( fp == NULL )
		perror("I found an error");

	return 0;
}
