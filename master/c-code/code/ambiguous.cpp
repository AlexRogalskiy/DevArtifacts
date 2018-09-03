#include "IntCell.h"
#include <iostream>
#include <string>
using namespace std;

template <typename Comparable>
const Comparable & max2( const Comparable & lhs,
                        const Comparable & rhs )
{
    return lhs > rhs ? lhs : rhs;
}

const string & max2( const string & lhs, const string & rhs )
{
    return lhs > rhs ? lhs : rhs;
}

int main( )
{
    string s = "hello";
    int    a = 37;
    double b = 3.14;

    cout << max2( a, a ) << endl;    // OK: expand with int
    cout << max2( b, b ) << endl;    // OK: expand with double
    cout << max2( s, s ) << endl;    // OK: not a template
//    cout << max2( a, b ) << endl;    // Ambiguous

    return 0;
}