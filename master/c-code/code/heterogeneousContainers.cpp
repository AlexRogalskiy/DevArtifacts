#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Person
{
  public:
    Person( int s, const string & n = "" )
      : ssn( s ), name( n )
    { }

    virtual ~Person( )
      { }

    const string & getName( ) const
      { return name; }

    int getSsn( ) const
      { return ssn; }

    virtual void print( ostream & out = cout ) const
      { out << ssn << ", " << name; }

  private:
    int ssn;
    string name;
};

ostream & operator<< ( ostream & out, const Person & p )
{
    p.print( out );
    return out;
}

class Student : public Person
{
  public:
    Student( int s, const string & n = "", double g = 0.0 )
      : Person( s, n ), gpa( g )
    { }

    double getGpa( ) const
      { return gpa; }

    void print( ostream & out = cout ) const
      { Person::print( out ); out << ", " << gpa; }

  private:
    double gpa;
};

ostream & operator<< ( ostream & out, const Person *p )
{
    return out << *p;
}

template <typename Container>
void print( const Container & c, ostream & out = cout )
{
    typename Container::const_iterator itr;
    for( itr = c.begin( ); itr != c.end( ); ++itr )
        out << "[" << *itr << "] ";
    out << endl;
}

int main( )
{
    vector<Person *> vec;

    vec.push_back( new Person( 987654321, "Bob" ) );
    vec.push_back( new Student( 123456789, "Jane", 4.0 ) );
    print( vec );

    return 0;
}