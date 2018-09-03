#include <iostream>
using namespace std;

// Illustrates how to pass a two-dimensional primitive array

int sum1( int m[2][3] )
{
    int totalSum = 0;
    for( int r = 0; r < 2; r++ )
        for( int c = 0; c < 3; c++ )
           totalSum += m[ r ][ c ];
    return totalSum;
}

int sum2( int m[ ][ 3 ], int rows )
{
    int totalSum = 0;
    for( int r = 0; r < rows; r++ )
        for( int c = 0; c < 3; c++ )
           totalSum += m[ r ][ c ];
    return totalSum;
}

// sum3 does not compile
/*
int sum3( int m[ ][ ], int rows, int cols )
{
    int totalSum = 0;
    for( int r = 0; r < rows; r++ )
        for( int c = 0; c < cols; c++ )
           totalSum += m[ r ][ c ];
    return totalSum;
}
*/

int sum4( int m[ ], int rows, int cols )
{
    int totalSum = 0;
    for( int r = 0; r < rows; r++ )
        for( int c = 0; c < cols; c++ )
           totalSum += m[ r * cols + c ];
    return totalSum;
}


int main( )
{
    int m[ 2 ][ 3 ] = { { 1, 2, 3 }, { 4, 5, 6 } };

    cout << sum1( m ) << endl;
    cout << sum2( m, 2 ) << endl;
//    cout << sum3( m, 2, 3 ) << endl;
    cout << sum4( &m[0][0], 2, 3 ) << endl;    // Yuk
    cout << sum4( (int *) m, 2, 3 ) << endl;   // Yuk

    return 0;
}