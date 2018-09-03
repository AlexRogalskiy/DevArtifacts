#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Shape
{
  public:
    Shape( const string & s ) : shapeType( s ) { }
    virtual ~Shape( ) { }

    const string & getType( ) const
      { return shapeType; }

    virtual double getArea( ) const = 0;
    virtual void print( ostream & out ) const
      { out << getType( ) << " of area " << getArea( ); }

  private:
    string shapeType;
};

ostream & operator<< ( ostream & out, const Shape & s )
{
    s.print( out );
    return out;
}

class Circle : public Shape
{
  public:
    Circle( double r ) : Shape( "Circle" ), radius( r )
      { }

    double getArea( ) const
      { return 3.14 * radius * radius; }

  private:
    double radius;
};

class Square : public Shape
{
  public:
    Square( double s ) : Shape( "Square" ), side( s )
      { }

    double getArea( ) const
      { return side * side; }

  private:
    double side;
};

void printShapes( const vector<Shape*> & a, ostream & out = cout )
{
    for( int i = 0; i < a.size( ); i++ )
        out << *a[ i ] << endl;
}

double totalArea( const vector<Shape*> & a )
{
    double sum = 0.0;

    for( int i = 0; i < a.size( ); i++ )
        sum += a[ i ]->getArea( );

    return sum;
}

void cleanup( vector<Shape *> & a )
{
    for( int i = 0; i < a.size( ); i++ )
        delete a[ i ];
}

void testShapes( )
{
    vector<Shape *> arr;

    arr.push_back( new Circle( 2.0 ) );
    arr.push_back( new Square( 2.0 ) );
    arr.push_back( new Square( 4.0 ) );

    printShapes( arr );
    cout << "Total area is " << totalArea( arr ) << endl;
    cleanup( arr );
}

int main( )
{
    testShapes( );
    return 0;
}
