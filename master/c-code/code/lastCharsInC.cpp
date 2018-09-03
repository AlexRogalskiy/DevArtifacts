#include <stdio.h>
#include <string>
#include <exception>
using namespace std;

#ifdef GNU_EXCEPTION_BUG
   #include "exceptions.h"
#endif

class io_exception { };

void lastChars( const string & fileName, int howMany )
{
    FILE *fin = fopen( fileName.c_str( ), "rb" );
    if( fin == NULL )
        throw io_exception( );   // made this one up
    else if( howMany <= 0 )
        throw invalid_argument( "howMany is negative" );

    fseek( fin, 0, SEEK_END );
    int fileSize = ftell( fin );
    if(  fileSize < howMany )
        howMany = fileSize;
    fseek( fin, -howMany, SEEK_END );

    int ch;
    while( ( ch = getc( fin ) ) != EOF )
        putc( ch, stdout );
    if( !feof( fin ) )
       throw io_exception( );
}

int main( )
{
    lastChars( "lastCharsInC.cpp", 100 );

    return 0;
}
