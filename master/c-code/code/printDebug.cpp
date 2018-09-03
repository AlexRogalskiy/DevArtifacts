#include <iostream>
using namespace std;

#define printDebug( expr ) cout << __FILE__  << " [" << __LINE__  \
               << "] (" << #expr << "): " << ( expr ) << endl;

int main( ) 
{ 
    int x = 5, y = 7; 

    printDebug( x + y ); 

    return 0; 
} 