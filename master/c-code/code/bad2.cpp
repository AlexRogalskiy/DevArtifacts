#include <iostream>
using namespace std;

class Account
{
  public:
    Account( int b = 0 )
      : balance( b ) { }
    int getBalance( ) const
      { return balance; }
    void deposit( int d )
      { balance += d; }

  private:
    int balance;
};

class Barbell
{
  public:
    Barbell( double b ) : weight( b ) { }
    double getWeight( ) const
      { return weight; }

  private:
    double weight;
};

int main( )
{
    Barbell *bb  = new Barbell( 15.6 );
    cout << bb->getWeight( ) << endl;

    Account *acc = (Account *) bb;
    cout << acc->getBalance( ) << endl;
    acc->deposit( 40 );
    cout << bb->getWeight( ) << endl;

    return 0;
}