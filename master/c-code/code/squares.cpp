#include <iostream>
#include <vector>
using namespace std;

int main( )
{
	vector<int> squares;

	for( int i = 0; i < 100; i++ )
		squares.push_back( i * i );

	for( int j = 0; j < squares.size( ); j++ )
		cout << j << " squared is " << squares[ j ] << endl;

	return 0;
}