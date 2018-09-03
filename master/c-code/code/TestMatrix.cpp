#include <iostream>
#include "Matrix.h"
using namespace std;

int main( )
{
    Matrix<int> m( 2, 2 );
    m[ 0 ][ 0 ] = 1; m[ 0 ][ 1 ] = 2;
    m[ 1 ][ 0 ] = 3; m[ 1 ][ 1 ] = 4;

    cout << "m has " << m.numrows( ) << " rows and "
                     << m.numcols( ) << " cols." << endl;

    cout << m[ 0 ][ 0 ] << " " << m[ 0 ][ 1 ] << endl <<
            m[ 1 ][ 0 ] << " " << m[ 1 ][ 1 ] << endl;
   
    return 0;
}