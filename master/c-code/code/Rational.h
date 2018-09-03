#ifndef _RATIONAL_H
#define _RATIONAL_H
#include <iostream>
using namespace std;

class Rational
{
  public:
      // Constructors
    Rational( int numerator = 0 )
      : numer( numerator ), denom( 1 ) { }
    Rational( int numerator, int denominator )
      : numer( numerator ), denom( denominator )
            { fixSigns( ); reduce( ); }

      // Assignment Ops
    const Rational & operator+=( const Rational & rhs );
    const Rational & operator-=( const Rational & rhs );
    const Rational & operator/=( const Rational & rhs );
    const Rational & operator*=( const Rational & rhs );

      // Unary Operators
    const Rational & operator++( );      // Prefix
    Rational operator++( int );          // Postfix
    const Rational & operator--( );      // Prefix
    Rational operator--( int );          // Postfix
    const Rational & operator+( ) const;
    Rational operator-( ) const;
    bool operator!( ) const;

      // Named Member Functions
    double toDouble( ) const             // Do the division
      { return static_cast<double>( numer ) / denom; }
    int toInt( ) const                   // Do the division
      { return numer >= 0 ? numer / denom : - ( -numer / denom ); }
    bool isPositive( ) const
      { return numer > 0; }
    bool isNegative( ) const
      { return numer < 0; }
    bool isZero( ) const
      { return numer == 0; }
    void print( ostream & out = cout ) const;
  private:
      // A rational number is represented by a numerator and
      // denominator in reduced form
    int numer;                      // The numerator
    int denom;                      // The denominator

    void fixSigns( );               // Ensures denom >= 0
    void reduce( );                 // Ensures lowest form
};

  // Math Binary Ops
Rational operator+( const Rational & lhs, const Rational & rhs );
Rational operator-( const Rational & lhs, const Rational & rhs );
Rational operator/( const Rational & lhs, const Rational & rhs );
Rational operator*( const Rational & lhs, const Rational & rhs );

  // Relational & Equality Ops
bool operator< ( const Rational & lhs, const Rational & rhs );
bool operator<=( const Rational & lhs, const Rational & rhs );
bool operator> ( const Rational & lhs, const Rational & rhs );
bool operator>=( const Rational & lhs, const Rational & rhs );
bool operator==( const Rational & lhs, const Rational & rhs );
bool operator!=( const Rational & lhs, const Rational & rhs );

  // I/O
ostream & operator<< ( ostream & out, const Rational & value );
istream & operator>> ( istream & in, Rational & value );

#endif