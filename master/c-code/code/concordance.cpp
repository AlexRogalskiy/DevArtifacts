#include <iostream>
#include <fstream>
#include <sstream>
#include <map>
#include <string>
#include <vector>
#include <iomanip>
using namespace std;


template <typename Container>
void print( const Container & c, ostream & out = cout )
{
    typename Container::const_iterator itr;
    for( itr = c.begin( ); itr != c.end( ); ++itr )
        out << *itr << " ";
    out << endl;
}

typedef vector<int> LList;
ostream & operator<<( ostream & out,
                      const pair<string,LList> & rhs )
{
    out << left << setw( 20 ) << rhs.first;
    print( rhs.second, out );   // Figure 10-1
    return out;
}

void printConcordance( istream & in, ostream & out )
{
    string             oneLine;
    map<string,LList>  wordMap;

        // Read the words; add them to wordMap
    for( int lineNum = 1; getline( in, oneLine ); lineNum++ )
    {
        istringstream st( oneLine );
        string word;

        while( st >> word )
            wordMap[ word ].push_back( lineNum );
    }

    map<string,LList>::iterator itr;
    for( itr = wordMap.begin( ); itr != wordMap.end( ); ++itr )
        out << *itr << endl;
}

int main( )
{
    ifstream fin( "concordance.cpp" );

    printConcordance( fin, cout );

    return 0;
}