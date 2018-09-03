#include <iostream>
#include <string>
using namespace std;

istream & getline( istream & in, string & str, char delim = '\n' );

istream & getline( istream & in, string & str, char delim )
{
    char ch;
    str = "";     // empty string, will build one char at-a-time
    
    while( in.get( ch ) && ch != delim )
        str += ch;
    
    return in;
}

int main( )
{
    string oneLine;

    while( getline( cin, oneLine ) )
        cout << oneLine << endl;

    return 0;
}