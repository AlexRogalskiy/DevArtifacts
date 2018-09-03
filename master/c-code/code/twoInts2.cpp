#include <iostream>
#include <sstream>
#include <string>
#include <exception>
using namespace std;

class io_exception { };

void twoInts( istream & fin ) throw( io_exception )
{
    string oneLine;
    istringstream st;

    while( getline( fin, oneLine ) )
    {
        st.str( oneLine );
        st.clear( );

        int x, y;
        st >> x;
        st >> y;
        if( st.fail( ) )
        {
            cerr << "Skipping line " << oneLine << endl;
            continue; 
        }
        string junk;
        if( st >> junk )
        {
            cerr << "Skipping line " << oneLine << endl;
            continue; 
        }

        cout << "Successfully read " << x << " " << y << endl;
    }
    if( !fin.eof( ) )
        throw io_exception( );
}

int main( )
{
    twoInts( cin );

    return 0;
}