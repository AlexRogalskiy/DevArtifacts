#include <iostream>
using namespace std;

void swap3( int *a, int *b )
{
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main( )
{
    int x = 5, y = 7;

    swap3( &x, &y );
    cout << "x=" << x << " y=" << y << endl;

    return 0;
}