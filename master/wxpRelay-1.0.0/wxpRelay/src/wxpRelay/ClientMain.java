package wxpRelay;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.DefaultMethodRetryHandler;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;

import java.net.Socket;
import java.net.InetSocketAddress;
import java.io.IOException;
import java.util.Random;

import sun.misc.CRC16;

/**
 * the client main
 */
public class ClientMain {
    private static Logger log = new Logger("[ClientMain]");
    private static boolean debug = false;
    private static TimSocket socket;

    // A few configurables
    public static final int RANDOM_SEED = 12745;        // a seed for the random number generator
    public static final int ERROR_THRESHOLD = 10;       // number of socket recv/send errors before restarting connection

    public static void main( String args[] ) {
        try {
            if( args.length != 4 )
                throw new Exception("errorArgs");

            debug = Boolean.valueOf(args[2]).booleanValue();

            // the server will disconnect us after we've sent a whole bunch of jpgs and then the requester hangs off,
            // so we'll just keep trying to connect back when that happens.
            OuterLoop:
            while( true ) {
                // initial sleep to give the server a second to breathe
                if( debug ) log.log("Top of while-loop.");
                Thread.sleep(500);
                do {
                    try {
                        socket = new TimSocket(new Socket());
                        if( debug ) log.log("Attempting to connect...");
                        socket.connect(new InetSocketAddress(args[0], Integer.parseInt(args[1])), 0);
                    } catch( Exception e ) {
                        // error while trying to connect
                        if( debug ) log.log("Exception trying to connect: " + e.getMessage());
                    }
                    if( !socket.isConnected() )
                        Thread.sleep(60000); // waitaminute
                } while( !socket.isConnected() );

                // server will now try and ping us
                if( !returnPing() ) {
                    socket.close();
                    continue OuterLoop;
                }

                if( debug ) log.log("Ping returned ok, connected happily");

                // by this point we should be connected happily. Await either a s_KEEPALIVE or a s_STARTCAM

                String nextMessage;
                do {
                    try {
                        if( debug ) log.log("Waiting for next command from ControlServer...");
                        nextMessage = socket.receiveString();
                    } catch( Exception e ) {
                        socket.close();
                        continue OuterLoop;
                    }
                } while( nextMessage.equals(Messages.s_KEEPALIVE) );

                if( nextMessage.equals(Messages.s_STARTCAM) ) {
                    if( debug )
                        log.log("got s_STARTCAM");
                    // start the cam - use httpclient to hammer away at the webCamXP server. Stop when server drops
                    // the connection. JPGs are started with the s_JPGSTART message.
                    HttpClient client = new HttpClient();
                    Random rand = new Random(RANDOM_SEED);
                    int picCount = 1;
                    int recvErrorCount = 0;
                    int sendErrorCount = 0;

                    while( true ) {
                        byte response[] = null;
                        try {
                            if( debug && picCount % 100 == 0)
                                log.log("Getting pic " + picCount);
                            GetMethod method = new GetMethod("http://" + args[3] + "/cam_1.jpg?uniq=" + rand.nextLong());
                            DefaultMethodRetryHandler retryhandler = new DefaultMethodRetryHandler();
                            retryhandler.setRequestSentRetryEnabled(false);
                            retryhandler.setRetryCount(0);
                            method.setMethodRetryHandler(retryhandler);
                            int statusCode = client.executeMethod(method);
                            response = method.getResponseBody();
                            method.releaseConnection();
                            if ( statusCode != HttpStatus.SC_OK )
                                throw new IOException("Method failed: " + method.getStatusLine());
                            if( response == null || response.length < 100 ) {
                                recvErrorCount += 1;
                                if( debug ) log.log("Got bogus response from webCamXP, not sending. Is error # " + recvErrorCount);
                                continue;
                            }
                            recvErrorCount = 0;
                        } catch (Exception e) {
                            recvErrorCount += 1;
                            log.log("ERROR: exception getting pic # " + picCount + ", is error # " + recvErrorCount + ": " + e.getMessage());
                            if( recvErrorCount > ERROR_THRESHOLD ) {
                                log.log("ERROR: send/recv error threshold breached, dropping connection.");
                                socket.close();
                                continue OuterLoop;
                            }
                        } try {
                            // calculate CRC
                            CRC16 crc = new CRC16();
                            for( int h=0 ; h < response.length ; h+=1 )
                                crc.update(response[h]);
                            if( debug && picCount % 100 == 0)
                                log.log("Sending pic " + picCount + " of size " + response.length + ", CRC is [" + crc.value + "]");
                            socket.sendString(Messages.s_CRCSTART + crc.value + Messages.s_CRCEND + Messages.s_SIZESTART + response.length + Messages.s_SIZEEND);
                            socket.send(response);
                            // pic count wraps at one million
                            if( picCount == 1000000 )
                                picCount = 1;
                            else
                                picCount += 1;
                            sendErrorCount = 0;
                        } catch (Exception e) {
                            sendErrorCount += 1;
                            log.log("ERROR: exception sending pic # " + picCount + ", is error # " + sendErrorCount + ": " + e.getMessage());
                            if( sendErrorCount > ERROR_THRESHOLD ) {
                                log.log("ERROR: send/recv error threshold breached, dropping connection.");
                                socket.close();
                                continue OuterLoop;
                            }
                        }
                    }

                } else {
                    // got some weird input
                    if( debug )
                        log.log("was expecting s_KEEPALIVE or s_STARTCAM, got something else: [" + nextMessage + "]");
                    socket.close();
                    continue OuterLoop;
                }

            } // end while(true)

        } catch( Exception e ) {
            if( e.getMessage().equals("errorArgs") ) {
                log.log("Client Usage: [controlHost] [controlPort] [debug] [webcamXP_location]\n" +
                        "\t... where:\n" +
                        "\t\tcontrolHost\t\tThe host that is running the control server\n" +
                        "\t\tcontrolPort\t\tThe port the control server is on\n" +
                        "\t\tdebug\t\ttrue or false, turns on debugging info\n" +
                        "\t\twecamXP_location\tWhere webCamXP is listening, eg. \"localhost:8080\""
                );
            } else {
                log.log("Exception: " + e.getMessage() + "\n\n");
            }
            System.exit(-1);
        } finally {
            socket.close();
        }
    }

    private static boolean returnPing() {
        if( debug )
            log.log("DEBUG: starting to return a ping...");
        try {
            if( !socket.receiveString().equals(Messages.s_HELLO) )
                return false;
            socket.sendString(Messages.ACK);
        } catch( Exception e ) {
            return false;
        }
        if( debug )
            log.log("DEBUG: ping successful.");
        return true;
    }

}
