#ifndef _OBJECTCELL_H
#define _OBJECTCELL_H

template <typename Object>
class ObjectCell
{
  public:
    explicit ObjectCell( const Object & initialValue = Object( ) )
        : storedValue( initialValue )
      { }

    const Object & getValue( ) const
      { return storedValue; }
    void setValue( const Object & val )
      { storedValue = val; }

  private:
    Object storedValue;
};

#endif
