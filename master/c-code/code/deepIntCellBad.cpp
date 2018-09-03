#include <iostream>
using namespace std;

class IntCell
{
  public:
    explicit IntCell( int initialValue = 0 )
      { storedValue = new int( initialValue ); }
    int getValue( ) const
      { return *storedValue; }
    void setValue( int val )
      { *storedValue = val; }

  private:
    int *storedValue;
};

int f( )
{
    IntCell a( 2 );
    IntCell b = a;
    IntCell c;

    c = b;
    a.setValue( 4 );
    cout << a.getValue( ) << endl << b.getValue( ) << endl
         << c.getValue( ) << endl;

    return 0;
}

int main( )
{
    return f( );
}
