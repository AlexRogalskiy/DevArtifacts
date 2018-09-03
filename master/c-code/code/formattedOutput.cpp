#include <iostream>
#include <string>
#include <vector>
#include <iomanip>
using namespace std;

class Person
{
  public:
    Person( const string & n = "", double s = 0.0 )
      : name( n ), salary( s ) { }

    void print( ostream & out = cout ) const
    {
        out << left << setw( 15 ) << name << " "
            << right << fixed
            << setprecision( 2 ) << setw( 12 ) << salary;
    }

  private:
    string name;
    double salary;
};

ostream & operator<< ( ostream & out, const Person & p )
{
    p.print( out );
    return out;
}

int main( )
{
    vector<Person> arr;
    arr.push_back( Person( "Pat", 40000.11 ) );
    arr.push_back( Person( "Sandy", 125443.10 ) );

    for( int i = 0; i < arr.size( ); i++ )
        cout << arr[ i ] << endl;

    return 0;
}