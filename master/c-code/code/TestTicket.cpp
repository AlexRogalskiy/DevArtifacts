#include <iostream>
#include "Ticket.h"
using namespace std;

int main( )
{
    cout << Ticket::getTicketCount( ) << " tickets" << endl;

    Ticket t1, t2, t3;
    cout << Ticket::getTicketCount( ) << " tickets" << endl;
    cout << "t2 is " << t2.getID( ) << endl;

    return 0;
}