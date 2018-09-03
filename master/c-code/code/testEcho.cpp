#include <iostream>
using namespace std;

int main( int argc, char *argv[ ] )
{
    cout << "Invoking command: " << argv[ 0 ] << endl;
    for( int i = 1; i < argc; i++ )
         cout << argv[ i ] << " ";
    cout << endl;

    return 0;
}