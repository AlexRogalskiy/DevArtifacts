#include "MathUtils.h"

vector<int> MathUtils::primes;
bool        MathUtils::forceStaticInit = staticInit( 10000000 );


bool MathUtils::isPrime( int n )
{
    int low = 0, high = primes.size( ) - 1;

    while( low <= high )
    {
        int mid = ( low + high ) / 2;
        if( primes[ mid ] == n )
            return true;
        else if( n < primes[ mid ] )
            high = mid - 1;
        else
            low = mid + 1;
    }

    return false; // not found
}