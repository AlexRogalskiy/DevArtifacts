class NativeSumDemo
{
    native public static double sum( double [] arr )
                                            throws Exception;
    
    static
    {
        System.loadLibrary( "Sum" );
    }
        
    public static void main( String[] args )
    {
        double [ ] arr1 = { 3.0, 6.5, 7.5, 9.5 };
        double [ ] arr2 = { };
 
        try
        {
            System.out.println( sum( arr1 ) );
            System.out.println( sum( arr2 ) );
        }
        catch( Exception e )
        {
            System.out.println( "Caught the exception!" );
            e.printStackTrace( );
        }
    }
}