#include <iostream>
#include <vector>
using namespace std;

// Print the contents of Container c in reverse
// Uses forward iterators, yields ugly code
template <typename Container>
void printReverseBad( const Container & c, ostream & out = cout )
{
    typename Container::const_iterator itr;

    for( itr = c.end( ), --itr; itr != c.begin( ); --itr )
        out << *itr << " ";
    if( !c.empty( ) )
        out << *c.begin( );
    out << endl;
}

// Print the contents of Container c in reverse
template <typename Container>
void printReverse( const Container & c, ostream & out = cout )
{
    typename Container::const_reverse_iterator itr;

    for( itr = c.rbegin( ); itr != c.rend( ); ++itr )
        out << *itr << " ";
    out << endl;
}

int main( )
{
    vector<int> v;

    v.push_back( 3 ); v.push_back( 1 ); v.push_back( 4 );

    printReverseBad( v );
    printReverse( v );

    return 0;
}