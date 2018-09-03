#include <iostream>
#include <cstdlib>
using namespace std;

// Read an unlimited number of ints with no attempts at error
// recovery; return a pointer to the data, and set ItemsRead
int * getInts( int & itemsRead )
{
    int arraySize = 0;
    int inputVal;
    int *array = NULL;   // Initialize to NULL pointer

    itemsRead = 0;
    cout << "Enter any number of integers: ";
    while( cin >> inputVal )
    {
        if( itemsRead == arraySize )
        {     // Array doubling code
            int *original = array;
            array = new int[ arraySize * 2 + 1 ];
            for( int i = 0; i < arraySize; i++ )
                array[ i ] = original[ i ];
            delete [ ] original; // Safe if Original is NULL
            arraySize = arraySize * 2 + 1;
        }
        array[ itemsRead++ ] = inputVal;
    }
    return array;
}

int main( )
{
    int *array;
    int numItems;

    array = getInts( numItems );
    for( int i = 0; i < numItems; i++ )
        cout << array[ i ] << endl;

    return 0;
}