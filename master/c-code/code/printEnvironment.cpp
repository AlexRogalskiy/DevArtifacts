#include <iostream>
using namespace std;

int main( int argc, char *argv[ ], char *envp[ ] )
{
    for( int i = 0; envp[ i ] != NULL; i++ )
         cout << envp[ i ] << endl;

    return 0;
}