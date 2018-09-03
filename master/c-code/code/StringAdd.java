class StringAdd
{
    native public static String add( String a, String b );

    static
    {
        System.loadLibrary( "StringAdd" );
    }

    public static void main( String [ ] args )
    {
        System.out.println( add( "Hello", "World" ) );
    }
}