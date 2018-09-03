#include "Rational.h"
#include <iostream>
using namespace std;

// Rational number test program
int main( )
{
    Rational x;
    Rational sum;
    int n;

    cout << "Type as many rational numbers as you want" << endl;

    for( sum = 0, n = 0; cin >> x; sum += x, n++ )
        cout << "Read " << x << endl;

    cout << "Read " << n << " rationals" << endl;
    cout << "Average is " << ( sum / n ) << endl;

    return 0;
}