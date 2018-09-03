#include <iostream>
using namespace std;

template <typename Type1, typename Type2>
class Pair
{
  public:
    Pair( const Type1 & f, const Type2 & s )
      : first( f ), second( s )
    { }

    template <typename Type3, typename Type4>
    Pair( const Pair<Type3,Type4> & rhs )
      : first( rhs.first ), second( rhs.second )
    { }

    void print( ostream & out = cout ) const
      { out << first << " " << second; }

    Type1 first;
    Type2 second;
};

int main( )
{
    Pair<int,float>   p1( 3, 4.0 );
    Pair<long,double> p2 = p1;

    p2.print( );

    return 0;
}