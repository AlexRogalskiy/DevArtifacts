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

int main( )
{
    Account *acc1 = new Account( );
    Account *acc2;
    int amount;

    acc1->deposit( amount );
    cout << acc1->getBalance( ) << endl;
    cout << acc2->getBalance( ) << endl;

    return 0;
}