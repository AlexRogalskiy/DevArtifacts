package wxpRelay;

import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.DefaultMethodRetryHandler;
import org.apache.commons.httpclient.methods.GetMethod;

import java.util.Random;
import java.io.IOException;

/**
 * Created by IntelliJ IDEA.
 * User: Tim Carr
 * Date: Jan 27, 2005
 * Time: 6:49:00 PM
 * To change this template use File | Settings | File Templates.
 */
public class TestMain {
    public static void main(String args[]) {
        try {
            byte[] inittest = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 113, 112, 111, 0,0,0,0,0,0 };
            String conv = new String(inittest);
            byte[] test = conv.getBytes(); 
            String marker = "qpo";
            int findPos = new String(test).indexOf(marker);
            byte[] newtest = new byte[test.length - (findPos + marker.length())];
            System.arraycopy(test, findPos+marker.length(), newtest, 0, test.length - (findPos + marker.length()));

            boolean worked = true;
            for(int i=0 ; i < 6 ; i+=1 ) {
                if( newtest[i] != (byte)0 )
                    break;
            }
            if(worked)
                System.out.println("WORKED, newtest.length is " + newtest.length);
            else
                System.out.println("DID NOT WORK!");
        } catch(Exception e) {
            System.out.println("DID NOT WORK! exception: " + e.getMessage());
        }

    }
}
