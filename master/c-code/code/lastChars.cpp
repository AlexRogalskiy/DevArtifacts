#include <iostream>
#include <fstream>
#include <string>
#include <exception>
using namespace std;

#ifdef GNU_EXCEPTION_BUG
   #include "exceptions.h"
#endif

class io_exception { };

void lastChars( const string & fileName, int howMany )
{
    ifstream fin( fileName.c_str( ), ios_base::binary );
    if( !fin )
        throw io_exception( );   // made this one up
    else if( howMany <= 0 )
        throw invalid_argument( "howMany is negative" );

    fin.seekg( 0, ios_base::end );
    int fileSize = fin.tellg( );
    if(  fileSize < howMany )
        howMany = fileSize;
    fin.seekg( -howMany, ios_base::cur );

    char ch;
    while( fin.get( ch ) )
        cout.put( ch );
}

int main( )
{
    lastChars( "lastChars.cpp", 100 );

    return 0;
}
