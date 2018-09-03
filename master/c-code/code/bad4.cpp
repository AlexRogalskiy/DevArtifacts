#include <iostream>
#include <vector>
using namespace std;

int main( )
{
    int i;
    vector<int> arr( 10, 37 );   // 10 items, all with val 37

    for( i = 0; i <= 10; i++)
        cout << i << " " << arr[ i ] << endl;

    return 0;
}