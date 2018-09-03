class Base
{
  public:
    virtual ~Base( ) { }
    virtual void foo( ) { }
};

class Derived : public Base
{
  public:
    void foo( int x ) { }
};

void test( Base & arg1, Derived & arg2 )
{
    arg1.foo( );       // OK
 //   arg1.foo( 4 );     // Illegal, as expected
    arg2.foo( 4 );     // Legal, as expected
 //   arg2.foo( );       // Illegal; not like Java
}

int main( )
{
    Derived d;

    test( d, d );
    return 0;
}