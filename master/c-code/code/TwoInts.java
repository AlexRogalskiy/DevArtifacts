import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

class TwoInts
{
    public static void twoInts( BufferedReader fin )
                                            throws IOException
    {
        String oneLine = null;
        while( ( oneLine = fin.readLine( ) ) != null )
        {
            int x = 0, y = 0;

            StringTokenizer st = new StringTokenizer( oneLine );
            if( st.countTokens( ) != 2 )
            {
                System.err.println( "Skipping line: " + oneLine );
                continue;
            }
            try
            {
                x = Integer.parseInt( st.nextToken( ) );
                y = Integer.parseInt( st.nextToken( ) );
            }
            catch( NumberFormatException e )
            {
                System.err.println( "Skipping line: " + oneLine );
                continue;
            }
            System.out.println( "Successfully read " + x + " " + y );
        }
    }

    public static void main( String [ ] args )
    {
        try
        {
            BufferedReader bin = new BufferedReader( new InputStreamReader( System.in ) );
            twoInts( bin );
        }
        catch( IOException e )
        {
            e.printStackTrace( );
        }
    }
}