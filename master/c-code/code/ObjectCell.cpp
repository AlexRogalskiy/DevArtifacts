#include "ObjectCell.h"

template <typename Object>
ObjectCell<Object>::ObjectCell( const Object & initialValue )
  : storedValue( initialValue )
{
}

template <typename Object>
const Object & ObjectCell<Object>::getValue( ) const
{
    return storedValue;
}

template <typename Object>
void ObjectCell<Object>::setValue( const Object & val )
{
    storedValue = val;
}
