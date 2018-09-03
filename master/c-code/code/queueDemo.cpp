#include <queue>
#include <iostream>
#include <list>
using namespace std;

int main( )
{
    queue<int,list<int> > q;
    q.push( 37 ); q.push( 111 );
    for( ; !q.empty( ); q.pop( ) )
        cout << q.front( ) << endl;

    return 0;
}