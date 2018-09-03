#include <iostream>
#include <string>
using namespace std;

int main( )
{
    const string h = "hello";

      // two failed attempts to change h
  //  h[ 0 ] = 'j';       // does not compile, thankfully
  //  string & href = h;  // does not compile, thankfully

      // third time is a charm
    string & ref = const_cast<string &> ( h );
    ref[ 0 ] = 'j';
    cout << h << endl;   // prints jello

    return 0;
}