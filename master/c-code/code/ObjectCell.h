#ifndef _OBJECTCELL_H
#define _OBJECTCELL_H

template <typename Object>
class ObjectCell
{
  public:
    explicit ObjectCell( const Object & initialValue = Object( ) );

    const Object & getValue( ) const;
    void setValue( const Object & val );

  private:
    Object storedValue;
};
#endif