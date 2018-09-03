#include <iostream>
#include <cmath>
#include <exception>
using namespace std;

#ifdef GNU_EXCEPTION_BUG
   #include "exceptions.h"
#endif




double mysqrt( double x ) throw( domain_error )
{
    if( x < 0 )
        throw domain_error( "sqrt of neg number" );
    else
        return sqrt( x );
}

double myexp( double x ) throw( out_of_range )
{
    double result = exp( x );   // call routines in cmath
    if( result == HUGE_VAL )
        throw out_of_range( "exp too large" );
    else
        return result;
}

double f( double x )
{
    try
    {
        return mysqrt( x ) + myexp( x );
    }
    catch( logic_error & e )
    {
        cout << "Caught exception " << e.what( ) << endl; // invoke correct what
        return -1.0;      // can’t be answer for any other x
    }
}

int main( )
{
    cout << f( 10 ) << endl;
    cout << f( -4 ) << endl;          // illegal sqrt
    cout << f( 10000000 ) << endl;    // illegal exp

    return 0;
}