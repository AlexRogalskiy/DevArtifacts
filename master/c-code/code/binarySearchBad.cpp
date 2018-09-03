#include <iostream>
#include <vector>
using namespace std;

// Broken binarySearch because of call-by-value
int binarySearch( vector<int> arr, int x )
{
    int low = 0, high = arr.size( ) - 1;

    while( low <= high )
    {
        int mid = ( low + high ) / 2;
        if( arr[ mid ] == x )
            return mid;
        else if( x < arr[ mid ] )
            high = mid - 1;
        else
            low = mid + 1;
    }

    return -1; // not found
}

int main( )
{
    vector<int> v;

    for( int i = 0; i < 30000; i++ )
        v.push_back( i * i );

    for( int j = 100000; j < 105000; j++ )
        if( binarySearch( v, j ) >= 0 )
            cout << j << " is a perfect square" << endl;

    return 0;
}