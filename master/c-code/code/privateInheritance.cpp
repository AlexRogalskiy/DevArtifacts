#include <iostream>
#include "IntCell.h"
using namespace std;

class NewCell : private IntCell
{
  public:
    explicit NewCell( int initialValue = 0 )
      : IntCell( initialValue ) { }

    int get( ) const
      { return getValue( ); }

    void put( int value )
      { setValue( value ); }
};

int main( )
{
    NewCell m( 37 );

    cout << m.get( ) << endl;
    // cout << m.getValue( ) << endl;  // doesn't compile

    return 0;
}