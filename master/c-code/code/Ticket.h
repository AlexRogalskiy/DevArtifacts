#ifndef _TICKET_H
#define _TICKET_H
class Ticket
{
  public:
    Ticket( ) : id( ++ticketCount )
      { }

    int getID( ) const
      { return id; }

    static int getTicketCount( )
      { return ticketCount; }

  private:
    int id;
    static int ticketCount;

    Ticket( const Ticket & rhs )
    {
        id = ++ticketCount;
    }

    const Ticket & operator= ( const Ticket & rhs )
    {
        if( this != &rhs )
            id = ++ticketCount;
        return *this;
    }
};
#endif