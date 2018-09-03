#include <iostream>
using namespace std;

class Printable
{
  public:
    virtual ~Printable( ) { }
    virtual void print( ostream & out = cout ) const = 0;
};

class Serializable
{
   public:
     virtual ~Serializable( ) { }
     virtual void readMe( istream & in = cin ) = 0;
     virtual void writeMe( ostream & out = cout ) const = 0;
};

class Person : public Printable, public Serializable
{
  public:
    void print( ostream & out = cout ) const
      { out << "printing a Person" << endl; }

    void readMe( istream & in = cin )
      { cout << "reading a Person" << endl; }
      
    void writeMe( ostream & out = cout ) const
      { out << "writing a Person" << endl; }
};

void doPrintOps( const Printable & obj )
{
    obj.print( );
}

void doSerializableOps( Serializable & obj )
{
    obj.readMe( );
    obj.writeMe( );
}

int main( )
{
    Person p;

    doPrintOps( p );
    doSerializableOps( p );

    return 0;
}