#include <iostream>
#include <vector>
#include "IntCell.h"
using namespace std;

// Return the maximum item in array a.
// Assume a.size( ) > 0.
// Comparable objects must provide operator<
template <typename Comparable>
const Comparable & findMax( const vector<Comparable> & a )
{
    int maxIndex = 0;

    for( int i = 1; i < a.size( ); i++ )
        if( a[ maxIndex ] < a[ i ] )
            maxIndex = i;

    return a[ maxIndex ];
}

#include "IntCell.h"
#include <string>
using namespace std;

int main( )
{
    vector<int>     v1;
    vector<double>  v2;
    vector<string>  v3;
    vector<IntCell> v4;
    vector<int>     v5;

    v1.push_back( 37 ); v1.push_back( 15 ); v1.push_back( 22 );
    v2.push_back( 3.7 ); v2.push_back( 1.5 ); v2.push_back( 2.2 );
    v3.push_back( "37" ); v3.push_back( "15" ); v3.push_back( "4" );
    v4.push_back( IntCell( 37 ) ); v4.push_back( IntCell( 15 ) );
    v5 = v1; v5.push_back( 39 );


    cout << findMax( v1 ) << endl; // OK: Comparable = int
    cout << findMax( v2 ) << endl; // OK: Comparable = double
    cout << findMax( v3 ) << endl; // OK: Comparable = string
 //   cout << findMax( v4 ) << endl; // Illegal: no operator<
    cout << findMax( v5 ) << endl; // OK: uses findMax, line 15

    return 0;
}