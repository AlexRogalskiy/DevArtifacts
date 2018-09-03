#include "MathUtils.h"
#include <iostream>
using namespace std;

int main( )
{
    for( int i = 5000000; i < 5010000; i++ )
        if( MathUtils::isPrime( i ) )
            cout << i << endl;

    return 0;
}