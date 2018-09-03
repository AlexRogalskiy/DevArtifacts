#include <iostream>
using namespace std;

class UnderflowException { };

class IntQueue
{
  private:

    class ListNode
    {
      public:
        int   element;
        ListNode *next;

        ListNode( int theElement, ListNode * n = NULL )
          : element( theElement ), next( n ) { }
    };

    ListNode *front;
    ListNode *back;

  public:
    IntQueue( ) : front( NULL ), back( NULL )
      { }

    IntQueue( const IntQueue & rhs )
       : front( NULL ), back( NULL )
      { *this = rhs; }

    ~IntQueue( )
      { makeEmpty( ); }

    const IntQueue & operator= ( const IntQueue & rhs )
    {
        if( this != &rhs )
        {
            makeEmpty( );
            ListNode *rptr;
            for( rptr = rhs.front; rptr != NULL; rptr = rptr->next )
                enqueue( rptr->element );
        }
        return *this;
    }

    void makeEmpty( )
    {
        while( !isEmpty( ) )
            dequeue( );
    }
    bool isEmpty( ) const
      { return front == NULL; }

    int getFront( ) const
    {
         if( isEmpty( ) )
            throw UnderflowException( );
        return front->element;
    }

    void enqueue( int x )
    {
        if( isEmpty( ) )
            back = front = new ListNode( x );
        else
            back = back->next = new ListNode( x );
    }

    int dequeue( )
    {
        int frontItem = getFront( );
        ListNode *old = front;
        front = front->next;
        delete old;
        return frontItem;
    }
};

int main( )
{
    IntQueue q1;

    for( int i = 0; i < 10; i++ )
        q1.enqueue( i );

    IntQueue q2 = q1;
    cout << "Q1: ";
    while( !q1.isEmpty( ) )
        cout << q1.dequeue( ) << " ";
    cout << endl;


    cout << "Q2: ";
    while( !q2.isEmpty( ) )
        cout << q2.dequeue( ) << " ";
    cout << endl;

    return 0;
}