// Find Friday the 13th birthdays for person born Oct 13, 1937

#include <ctime>
#include <iostream>
using namespace std;

int main( )
{
    const int FRIDAY = 6 - 1;           // Sunday is 0, etc...
    tm theTime = { 0 };                 // Set all fields to 0

    theTime.tm_mon = 10 - 1;            // January is 0, etc...
    theTime.tm_mday = 13;               // 13th day of the month

    for( int year = 1937; year < 2037; year++ )
    {
        theTime.tm_year = year - 1900;  // 1900 is 0, etc... 
        if( mktime( &theTime ) == -1 )
        {
            cerr << "mktime failed in " << year << endl;
            continue;
        }
        if( theTime.tm_wday == FRIDAY )
            cout << asctime( &theTime );
    }
    return 0;
}
