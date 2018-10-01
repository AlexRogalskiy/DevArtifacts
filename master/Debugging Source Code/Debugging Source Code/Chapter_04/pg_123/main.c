#include <stdio.h>


int f(int x)
{  
   return x*x; 
}


int (*p)(int);  


int main( void )
{
   p = f;
   int u = (*p)(5);
   printf("%d\n", u);

	return 0;
}
