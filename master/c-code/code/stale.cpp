#include <iostream>
#include <string>
using namespace std;

string * dup( const string & str )
{
    string ret = str + str;
    return &ret;
}

int main( )
{
    string *result = dup( "call" );
    cout << *result << endl;
    cout << "Now the string is " << *result << endl;
    return 0;
}