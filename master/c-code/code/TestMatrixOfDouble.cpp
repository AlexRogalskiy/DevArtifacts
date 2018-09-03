#include <iostream>
#include "MatrixOfDouble.h"
using namespace std;

ostream & operator<< ( ostream & out, const MatrixOfDouble & m )
{
    for( int r = 0; r < m.numrows( ); r++ )
    {
        for( int c = 0; c < m.numcols( ); c++ )
            out << m[ r ][ c ] << ' ';
        out << '\n';
    }

    return out;
}


int main( )
{
    MatrixOfDouble m( 2, 3 );

    for( int r = 0; r < m.numrows( ); r++ )
        for( int c = 0; c < m.numcols( ); c++ )
            m[ r ][ c ] = r * c;

    m[ 0 ][ 1 ] = 3.14;

    cout << m << endl;
}