#include <iostream>
#include <vector>
using namespace std;

  // leaks memory on systems that don't garbage collect
void leak( int i )
{
    vector<int> *ptrToVector = new vector<int>( i );
    if( i % 2 == 1 )
        return;

    ptrToVector->push_back( i );
    delete ptrToVector;
}

int main( )
{
    for( int i = 0; i < 10000; i++ )
         leak( 500001 );

    return 0;
}