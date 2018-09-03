
#ifndef _EXCEPTIONS_H
#define _EXCEPTIONS_H


class logic_error : public exception
{
  public:
    logic_error( char *msg )
      : mesg( msg )
    { }

    const char *what( ) const
      { return mesg; }

  private:
    const char *mesg;
};

class domain_error : public logic_error
{
  public:
    domain_error( char *msg )
      : logic_error( msg )
    { }
};

class out_of_range : public logic_error
{
  public:
    out_of_range( char *msg )
      : logic_error( msg )
    { }
};

class invalid_argument : public logic_error
{
  public:
    invalid_argument( char *msg )
      : logic_error( msg )
    { }
};

#endif

