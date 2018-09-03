/**
 * Example of Comparator, with rectangles.
 */
#include <stdlib.h>

#include <iostream>
#include <vector>
using namespace std;


/**
 * A simple rectangle class.
 */
class Rectangle
{
  public:
    explicit Rectangle( int len = 0, int wid = 0 )
      : length( len ), width( wid ) { }

    int getLength( ) const
      { return length; }

    int getWidth( ) const
      { return width; }

    void print( ostream & out = cout ) const
      { out << "Rectangle " << getLength( ) << " by " << getWidth( ); }

  private:
    int length;
    int width;
};

ostream & operator<< ( ostream & out, const Rectangle & rhs )
{
    rhs.print( out );
    return out;
}

/**
 * Compare object: ordering by length.
 */
class LessThanByLength
{
  public:
    bool operator( ) ( const Rectangle & lhs, const Rectangle & rhs ) const
      { return lhs.getLength( ) < rhs.getLength( ); }
};


/**
 * Compare object: ordering by area.
 */
class LessThanByArea
{
  public:
    bool operator( ) ( const Rectangle & lhs, const Rectangle & rhs ) const
      { return lhs.getLength( ) * lhs.getWidth( ) <
               rhs.getLength( ) * rhs.getWidth( ); }
};

/**
 * Generic findMax, with a function object.
 * Precondition: a.size( ) > 0.
 */
template <class Object, class Comparator>
const Object & findMax( const vector<Object> & a, Comparator isLessThan )
{
    int maxIndex = 0;

    for( int i = 1; i < a.size( ); i++ )
        if( isLessThan( a[ maxIndex ], a[ i ] ) )
            maxIndex = i;

    return a[ maxIndex ];
}

/**
 * main: create four rectangles.
 * find the max, two ways
 */
int main( )
{
    vector<Rectangle> a;

    a.push_back( Rectangle( 1, 10 ) );
    a.push_back( Rectangle( 10, 1 ) );
    a.push_back( Rectangle( 5, 5 ) );
    a.push_back( Rectangle( 4, 6 ) );

    cout << "Largest length:\n\t" << findMax( a, LessThanByLength( ) ) << endl;
    cout << "Largest area:\n\t" << findMax( a, LessThanByArea( ) ) << endl;

    return 0;
}

