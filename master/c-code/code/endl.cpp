#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <cstdlib>
#include <cassert>
#include <csignal>
#include <ctime>
#include <cstdio>
using namespace std;

// This code to copy files uses an efficient getline discussed in Chapter 12.
// In main program,
// actors.list is the uncompressed actors.list.gz
// available at ftp://ftp.imdb.com/pub/interfaces/

bool getline( FILE *fin, string & oneLine )
{
	static const int MAX_LINE_LEN = 100;
	char str[ MAX_LINE_LEN + 2 ];

	oneLine.erase( );   // faster than = ""
	for( ; ; oneLine += str )
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

  // Change endl to "\n" to see difference in running time
#define NEW_LINE endl

void copy( string dest, string source )
{
	int lines = 0;
	int chars = 0;
	string oneLine;

	time_t start = time( NULL );

	FILE *fp = fopen( source.c_str( ), "r" );
	ofstream fout( dest.c_str( ) );

	for( ; getline( fp, oneLine ); lines++ )
	{
		fout << oneLine << NEW_LINE;
		chars += oneLine.length( );
	}
	fclose( fp );
	
	cout << "DONE " << lines << " and " << chars << " in " << ( time( NULL ) - start ) << endl;
}

int main( )
{
	copy( "copy1.list", "C:\\cop3530_spr02\\actors.list" );

	return 0;
}