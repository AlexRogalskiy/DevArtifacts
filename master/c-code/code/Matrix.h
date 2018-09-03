#ifndef _MATRIX_H
#define _MATRIX_H
#include <vector>
using namespace std;

template <typename Object>
class Matrix
{
  public:
    Matrix( int rows, int cols ) : array( rows )
      { setNumCols( cols ); }

    int numrows( ) const
      { return array.size( ); }
    int numcols( ) const
      { return numrows( ) > 0 ? array[ 0 ].size( ) : 0; }

    void setNumRows( int rows )
      { array.resize( rows ); }      
    void setNumCols( int cols )
      { for( int i = 0; i < numrows( ); i++ )
          array[ i ].resize( cols );
      }
    void setDimensions( int rows, int cols )
      { setNumRows( rows ); setNumCols( cols ); }

    const vector<Object> & operator[]( int row ) const
      { return array[ row ]; }
    vector<Object> & operator[]( int row )
      { return array[ row ]; }

   private:
      vector< vector<Object> > array;
};

#endif