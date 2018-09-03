#ifndef _MATHUTILS_H
#define _MATHUTILS_H

#include <vector>
using namespace std;

class MathUtils
{
  public:
    static bool isPrime( int n );

  private:
    static vector<int> primes;
    static bool forceStaticInit;

    static bool staticInit( int n )
    {
          // Use Sieve of Erastothenis to eliminate non-primes
        vector<bool> nums( n + 1, true );
        for( int i = 2; i * i <= n; i++ )
            for( int j = i * 2; j <= n; j += i )
                nums[ j ] = false;

        for( int k = 2; k <= n; k++ )
            if( nums[ k ] )
                primes.push_back( k );

        return true;
    }
};
#endif