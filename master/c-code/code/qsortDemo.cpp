#include <cstdlib>
#include <iostream>
using namespace std;

int intCmp( const void *lhs, const void *rhs )
{
  int lhint = *(const int *)lhs;
  int rhint = *(const int *)rhs;
  return lhint < rhint ? -1 : lhint > rhint;
}

int main( )
{
    int arr[ ] = { 3, 5, 1, 2, 6 };
    int SIZE = sizeof( arr ) / sizeof( arr[ 0 ] );

    qsort( arr, SIZE, sizeof( int ), intCmp );
    for( int i = 0; i < SIZE; i++ )
        cout << arr[ i ] << endl;

    return 0;
}