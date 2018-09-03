#ifndef _INTCELL_H
#define _INTCELL_H

class IntCell
{
  public:
    explicit IntCell( int initialValue = 0 );

    int getValue( ) const;
    void setValue( int val );

  private:
    int storedValue;
};
#endif