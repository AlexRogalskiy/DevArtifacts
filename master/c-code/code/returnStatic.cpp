#include <iostream>
#include <string>
using namespace std;

string * dup( const string & str )
{
    static string ret;
    ret = str + str;
    return &ret;
}

int main( )
{
    string *s1 = dup( "hello" );
    string *s2 = dup( "world" );
    cout << *s1 << " " << *s2 << endl;

    return 0;
}