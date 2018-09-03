#include "Rational.h"

#include <iostream>
using namespace std;

namespace
{
      // n is guaranteed non-negative
	int gcd1( int n, int m )
	{
		if( n % m == 0 )
			return m;
		else
			return gcd1( m, n % m );
	}

	int gcd( int m, int n )
	{
		if( m > 0 )
			return gcd1( n, m );
		else
			return gcd1( n, -m );
	}
}

void Rational::fixSigns( )
{
    if( denom < 0 )
    {
        denom = -denom;
        numer = -numer;
    }
}

void Rational::reduce( )
{
    int d = 1;

    if( denom != 0 && numer != 0 )
        d = gcd( numer, denom );

    if( d > 1 )
    {
        numer /= d;
        denom /= d;
    }
}

const Rational & Rational::operator+=( const Rational & rhs )
{
    numer = numer * rhs.denom + rhs.numer * denom;
    denom = denom * rhs.denom;
    reduce( );

    return *this;
}

const Rational & Rational::operator-=( const Rational & rhs )
{
    numer = numer * rhs.denom - rhs.numer * denom;
    denom = denom * rhs.denom;
    reduce( );

    return *this;
}


const Rational & Rational::operator*=( const Rational & rhs )
{
    int newNumer = numer * rhs.numer;
    int newDenom = denom * rhs.denom;

    numer = newNumer;
    denom = newDenom;
    reduce( );

    return *this;
}

const Rational & Rational::operator/=( const Rational & rhs )
{
    int newNumer = numer * rhs.denom;
    int newDenom = denom * rhs.numer;

    numer = newNumer;
    denom = newDenom;

    fixSigns( );
    reduce( );

    return *this;
}

Rational operator+( const Rational & lhs, const Rational & rhs )
{
    Rational answer( lhs );   // Initialize answer with lhs
    answer += rhs;            // Add the second operand
    return answer;            // Return answer by copy
}


Rational operator-( const Rational & lhs, const Rational & rhs )
{
    Rational answer( lhs );   // Initialize answer with lhs
    answer -= rhs;            // Subtract the second operand
    return answer;            // Return answer by copy
}

Rational operator*( const Rational & lhs, const Rational & rhs )
{
    Rational answer( lhs );   // Initialize answer with lhs
    answer *= rhs;            // Multiply the second operand
    return answer;            // Return answer by copy
}

Rational operator/( const Rational & lhs, const Rational & rhs )
{
    Rational answer( lhs );   // Initialize answer with lhs
    answer /= rhs;            // Divide the second operand
    return answer;            // Return answer by copy
}


bool operator==( const Rational & lhs, const Rational & rhs )
{
    return (lhs - rhs).isZero( );
}


bool operator!=( const Rational & lhs, const Rational & rhs )
{
    return (!lhs - rhs).isZero( );
}

bool operator<( const Rational & lhs, const Rational & rhs )
{
    return (lhs - rhs).isNegative( );
}

bool operator>( const Rational & lhs, const Rational & rhs )
{
    return (lhs - rhs).isPositive( );
}

bool operator<=( const Rational & lhs, const Rational & rhs )
{
    return !(lhs - rhs).isPositive( );
}

bool operator>=( const Rational & lhs, const Rational & rhs )
{
    return (!lhs - rhs).isNegative( );
}


const Rational & Rational::operator++( )  // Prefix form
{
    numer += denom;
    return *this;
}

Rational Rational::operator++( int )      // Postfix form
{
    Rational tmp = *this;
    numer += denom;
    return tmp;
}

const Rational & Rational::operator--( )  // Prefix form
{
    numer -= denom;
    return *this;
}

Rational Rational::operator--( int )      // Postfix form
{
    Rational tmp = *this;
    numer -= denom;
    return tmp;
}

bool Rational::operator!( ) const
{
    return !numer;
}

const Rational & Rational::operator+( ) const
{
    return *this;
}

Rational Rational::operator-( ) const
{
    return Rational( -numer, denom );
}

istream & operator>>( istream & in, Rational & value )
{
    int num;
    int den = 1;

    in >> num;

    char ch;
    in.get( ch );
    
    if( !in.eof( ) )
    {
        if( ch == '/' )
            in >> den;
        else
            in.putback( ch );
    }

    value = Rational( num, den );
    return in;
}

void Rational::print( ostream & out ) const
{
    if( denom != 0 )
    {
        out << numer;
        if( denom != 1 )
            out << '/' << denom;
    }
        // Messy code for denom == 0
    else if( numer == 0 )
        out << "indeterminate";
    else
    {
        if( numer < 0 )
            out << '-';
        out << "infinity";
    }
}


ostream & operator<<( ostream & out, const Rational & value )
{
	value.print( out );
	return out;
}