#include <iostream>
#include <string>
using namespace std;

// return a string that contains n As
// In Java this code takes forever
string makeLongString( int n )
{
	string result = "";

	for( int i = 0; i < n; i++ )
		result += "A";

	return result;
}

int main( )
{
	string manyAs = makeLongString( 250000 );

	cout << "Short string is " << makeLongString( 20 ) << endl;
	cout << "Length is " << manyAs.length( ) << endl;

	return 0;
}