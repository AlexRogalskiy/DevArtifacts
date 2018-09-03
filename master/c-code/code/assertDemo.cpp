#include <iostream>
#include <string>
#include <cassert>
using namespace std;

void foo( string *s )
{
    assert( s != NULL );
    
    cout << *s << endl;
}

int main( )
{
    string *s = new string( "hello" );

    foo( s );
    foo( 0 );    // NULL

    return 0;
}