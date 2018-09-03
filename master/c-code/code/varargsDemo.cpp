#include <iostream>
#include <cstdarg>
using namespace std;

void printStrings( const char *str1, ... )
{
    const char *nextStr;
    va_list argp;

    cout <<  str1 << endl;
    va_start( argp, str1 );
    while( ( nextStr = va_arg( argp, const char * ) ) != NULL )
        cout << nextStr << endl;

    va_end( argp );
}

int main( )
{
    printStrings( "This", "is", "a", "test", (const char *) NULL );
    return 0;
}