#include <vector>
#include <queue>
#include <functional>
#include <string>
#include <iostream>
using namespace std;

// Empty the priority queue and print its contents.
template <typename PQueue>
void dump( const string & msg, PQueue & pq, ostream & out = cout )
{
    if( pq.empty( ) )
        out << msg << " is empty" << endl;
    else
    {
        out << msg << ": " << pq.top( );
        pq.pop( );
        while( !pq.empty( ) )
        {
            out << " " <<  pq.top( );
            pq.pop( );
        }
        out << endl;
    }
}

int main( )
{
    priority_queue<int>                           maxpq;
    priority_queue<int,vector<int>,greater<int> > minpq;

    minpq.push( 8 ); minpq.push( 5 ); minpq.push( 5 );
    maxpq.push( 8 ); maxpq.push( 5 ); maxpq.push( 5 );

    dump( "minpq", minpq );    // minpq: 5 5 8
    dump( "maxpq", maxpq );    // maxpq: 8 5 5

    return 0;
}