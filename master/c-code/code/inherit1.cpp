#include <iostream>
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

int main( )
{
    Student s( 123456789, "Jane", 4.0 );
    const Person & p = s;               // p and s are same object
    cout << s << '\n' << p << endl;     // calls Student::print

    return 0;
}