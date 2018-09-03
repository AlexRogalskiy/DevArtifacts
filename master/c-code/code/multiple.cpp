#include <iostream>
#include <string>
using namespace std;

class Person
{
   public:
     Person( const string & n, const string & t )
       : name( n ), ptype( t ) { }
     virtual ~Person( ) { }

     const string & getName( ) const
       { return name; }

     const string getPtype( ) const
       { return ptype; }

   private:
     string name;
     string ptype;
};

class Student : virtual public Person
{
  public:
    Student( const string & n, int h )
     : Person( "Student", n ), hours( h ) { }
    int getCreditHours( ) const    // credit hours taken
      { return hours; }

  private:
    int hours;                 
};

class Employee : virtual public Person
{
  public:
    Employee( const string & n, int h )
      : Person( "Employee", n ), hours( h ) { }
    int getVacationHours( ) const   // vacation hours left
      { return hours; }

  private:
    int hours;
};

class StudentEmployee : public Student, public Employee
{
  public:
    StudentEmployee( const string & n, int ch, int vh )
      : Person( "StudentEmployee", n ),
        Student( "ignored", ch ), Employee( "ignored", vh )
    { }
};

int main( )
{
    StudentEmployee e( "Joe", 120, 15 );

    cout << e.getName( ) << ' ' << e.getPtype( ) << ' ' << 
            e.getCreditHours( ) << ' ' << e.getVacationHours( ) << endl;

    return 0;
}