#include <iostream>
#include <vector>
#include <list>
#include <set>
#include <map>
#include <string>
using namespace std;

template <typename Container>
void print( const Container & c, ostream & out = cout )
{
    typename Container::const_iterator itr;
    for( itr = c.begin( ); itr != c.end( ); ++itr )
        out << *itr << " ";
    out << endl;
}

template <typename Type1, typename Type2>
ostream & operator<<( ostream & out, const pair<Type1,Type2> & p )
{
    return out << "[" << p.first << "," << p.second << "]";
}

int main( )
{
    vector<int> vec;
    vec.push_back( 3 ); vec.push_back( 4 );

    list<double> lst;
    lst.push_back( 3.14 ); lst.push_front( 6.28 );

    set<string> s;
    s.insert( "foo" ); s.insert( "bar" ); s.insert( "foo" );

    multiset<string> ms;
    ms.insert( "foo" ); ms.insert( "bar" ); ms.insert( "foo" );

    print( vec );     // 3 4
    print( lst );     // 6.28 3.14
    print( s );       // bar foo
    print( ms );      // bar foo foo


    map<string,string> zip;

    zip.insert( pair<string,string>( "Miami", "33199" ) );
    zip.insert( pair<string,string>( "Princeton", "08544" ) );
    zip[ "Boston" ] = "02134";

      // Prints: [Boston,02134] [Miami,33199] [Princeton,08544]
    print( zip );

    return 0;
}