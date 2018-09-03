#include <iostream>
#include <sstream>
#include <string>
using namespace std;

template <typename Object>
string toString( const Object & x )
{
    ostringstream os;
    os << x;
    return os.str( );
}

class Person
{
  public:
    Person( const string & n = "", double s = 0.0 )
      : name( n ), salary( s ) { }

    void print( ostream & out = cout ) const
      { out <<  name << " " << salary; }

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
    string s1 = toString( Person( "Jane", 123456 ) );
    string s2 = toString( 45 );
    string s3 = toString( 3.14 );

    cout << s1 << '\n' << s2 << '\n' << s3 << endl;

    return 0;
}