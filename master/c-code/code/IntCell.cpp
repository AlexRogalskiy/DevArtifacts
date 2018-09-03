#include "IntCell.h"

IntCell::IntCell( int initialValue )
  : storedValue( initialValue )
{
}

int IntCell::getValue( ) const
{
    return storedValue;
}

void IntCell::setValue( int val )
{
    storedValue = val;
}