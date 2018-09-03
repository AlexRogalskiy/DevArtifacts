#include <iostream>
#include <string>
#include <cstdio>
using namespace std;

bool getline( FILE *fin, string & oneLine )
{
    static const int MAX_LINE_LEN = 100;
    char str[ MAX_LINE_LEN + 2 ];

    for( oneLine.erase( ); ; oneLine += str )
    {
        char *result = fgets( str, MAX_LINE_LEN, fin );
        if( result == NULL )
            return oneLine.length( ) != 0;

        int len = strlen( str );
        if( str[ len - 1 ] == '\n' )
        {
            str[ len - 1 ] = '\0';
            break;
        }
    }

    oneLine += str;
    return true;
}

int countLines( char *fileName )
{
    FILE *fp = fopen( fileName, "r" );
    if( fp == NULL )
        return 0;

    int lines = 0;
    string oneLine;

    while( getline( fp, oneLine ) )
        lines++;

    return lines;
}

int main( int argc, char *argv[ ] )
{
    int totalLines = 0;

    for( int i = 1; i < argc; i++ )
    {
        int lines = countLines( argv[ i ] );
        cout << argv[ i ] << " " << lines << " lines" << endl;
        totalLines += lines;
    }

    cout << "Total " << totalLines << " lines" << endl;

    return 0;
}