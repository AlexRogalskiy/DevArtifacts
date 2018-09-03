class HelloNative
{
    native public static void hello( );

    static
    {
        System.loadLibrary( "HelloNative" );
    }
}

class HelloNativeTest
{
    public static void main( String[ ] args )
    {
        HelloNative.hello( );
    }
}