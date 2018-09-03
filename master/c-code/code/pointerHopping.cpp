#include <iostream>
using namespace std;

// initialize implemented with usual indexing mechanism
void initialize1( int arr[ ], int n, int val )
{
    for( int i = 0; i < n; i++ )
        arr[ i ] = val;
}

// initialize implemented with pointer hopping
void initialize2( int arr[ ], int n, int val )
{
    int *endMarker = arr + n;
    for( int *p = arr; p != endMarker; p++ )
        *p = val;
}

void print( int arr[ ], int n )
{
    for( int i = 0; i < n; i++ )
        cout << i << " " << arr[ i ] << endl;
}

int main( )
{
    int arr[ 10 ];

    initialize1( arr, 10, 37 );
    print( arr, 10 );

    cout << endl;

    initialize2( arr, 10, 42 );
    print( arr, 10 );

    return 0;
}