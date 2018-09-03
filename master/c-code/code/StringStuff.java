class StringStuff
{
    native public static int totalChars( String [ ] arr );

    public static int totalCharsJava( String [ ] arr )
    {
        int total = 0;

        for( int i = 0; i < arr.length; i++ )
             total += arr[ i ].length( );

        return total;
    }

    static
    {
        System.loadLibrary( "StringStuff" );
    }

    public static void main( String [ ] args )
    {
        String [ ] arr = new String[ 10000 ];

        for( int i = 0; i < arr.length; i++ )
            arr[ i ] = "" + i;

        System.out.println( totalChars( arr ) );
        System.out.println( totalCharsJava( arr ) );
    }
}