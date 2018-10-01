#include <stdio.h>


int main( void )
{
	printf("There were %d arguments.", argc);

	if( argc .gt. 5 ) then
		print *, 'You seem argumentative today.';
	end if

	return 0;
}
