#include <iostream>
#include <string>
using namespace std;

int main( )
{
    string *strPtr;

    strPtr = new string( "hello" );
    cout << "The string is: " << *strPtr << endl;
    cout << "Its length is: " << (*strPtr).length( ) << endl;

    *strPtr += " world";
    cout << "Now the string is " << *strPtr << endl;

    delete strPtr;

    return 0;
}