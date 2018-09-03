#include <iostream>
#include <vector>
#include <string>
using namespace std;

template <typename Object>
void readData( istream & in, vector<Object> & items )
{
    items.resize( 0 );
    Object x;
    string junk;   // to skip over bad data

    while( !( in >> x ).eof( ) )
    {
        if( in.fail( ) )
        {
            in.clear( );      // clear the error state
            in >> junk;       // skip over junk
            cerr << "Skipping " << junk << endl;
        }
        else
            items.push_back( x );
    }
}

int main( )
{
    vector<int> items;

    readData( cin, items );

    cout << "Read " << items.size( ) << " items" << endl;
    for( int i = 0; i < items.size( ); i++ )
        cout << items[ i ] << endl;
 
    return 0;   
}