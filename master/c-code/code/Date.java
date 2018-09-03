class Date
{
    public Date( int m, int d, int y )
      { month = m; day = d; year = y; }
 
    static
    {
        System.loadLibrary( "Date" );
    }

    native public void printDate( );

    public int getMonth( )
      { return month; }
    public int getDay( )
      { return day; }
    public int getYear( )
      { return year; }

    public String toString( )
      { return month + "/" + day + "/" + year; }

    private int month;
    private int day;
    private int year;
}