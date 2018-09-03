#include <iostream>
using namespace std;

// Correct implementation of swap2
void swap2( int & a, int & b )
{
	int tmp = a;
	a = b;
	b = tmp;
}

int main( )
{
	int x = 37;
	int y = 52;

	swap2( x, y );

	cout << x << " " << y << endl;

	return 0;
}