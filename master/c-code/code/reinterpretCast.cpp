#include <iostream>
using namespace std;


void clear1( char arr[ ], int n )
{
    for( int i = 0; i < n; i++ )
        arr[ i ] = 0;
}

void clear2( char arr[ ], int n )
{
    int *iarr = reinterpret_cast<int *>( arr );
    int newn = n / sizeof( int );     // number of ints
    int extras = n % sizeof( int );   // extra chars leftover

    for( int i = 0; i < newn; i++ )
        iarr[ i ] = 0;

    for( int j = n - extras; j < n; j++ )
        arr[ j ] = 0;
}

const int SIZE = 12000003;
char arr1[ SIZE ];
char arr2[ SIZE ];

int main( )
{
    cout << "Starting" << endl;

    clear1( arr1, SIZE );
    cout << "clear1 finished" << endl;

    clear2( arr2, SIZE );
    cout << "clear2 finished" << endl;

    for( int i = 0; i < SIZE; i++ )
        if( arr1[ i ] != arr2[ i ] ) 
            cout << "OOPS!! " << i << " " << arr1[ i ] << " " << arr2[ i ] << endl;

    return 0;
}