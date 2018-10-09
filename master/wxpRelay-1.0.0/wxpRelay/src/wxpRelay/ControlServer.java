package wxpRelay;

import java.net.ServerSocket;
import java.io.IOException;
import java.io.FileOutputStream;

/**
 * The server that takes the original connection from the remote computer with the cam; keeps
 * the connection open/alive
 */
public class ControlServer extends Thread {
    private ServerSocket serverSocket;
    private TimSocket conversationSocket;
    public static boolean debug;
    private Logger log;
    // number of milliseconds after the last person stops requesting jpgs to stop the cam stream
    public final static long CAM_TIMEOUT_MILLIS = 5000;
    // number of seconds until keepalive sent down control connection
    public final static int KEEPALIVE_TIMEOUT = 5;
    // max size of an incoming jpg
    public final static int MAX_JPG_SIZE = 20000;

    public ControlServer(int port, boolean debg) {
        log = new Logger("[ControlServer:" + port + "]");
        debug = debg;
        try {
            serverSocket = new ServerSocket(port);
        } catch (IOException e) {
            log.log("ERROR: couldn't make serverSocket on port [" + port + "]");
        }
    }

    public void run() {
        try {
            outerLoop:
            while( true ) {
                if( debug ) log.log("Top of while-loop, setting connected = false");
                Connection.getInstance().setConnected(false);
                if( debug ) log.log("Waiting for an incoming connection from the client...");
                conversationSocket = new TimSocket(serverSocket.accept());
                // client is connected! make sure we have connectivity
                if( !pingClient() ) {
                    conversationSocket.close();
                    continue outerLoop;
                }
                // let the Connection class know we're connected
                if( debug ) log.log("Client is connected, setting connected = true...");
                Connection.getInstance().setConnected(true);
                // has the cam already been requested?
                int sleepCount = 0;
                while( !Connection.getInstance().isRequested() ) {
                    Thread.sleep(1000);
                    sleepCount += 1;
                    if( sleepCount == KEEPALIVE_TIMEOUT ) {
                        if( !doKeepAlive() ) {
                            if( debug ) log.log("KEEPALIVE failed. Closing connection.");
                            conversationSocket.close();
                            continue outerLoop;
                        }
                        if( debug ) log.log("KEEPALIVE successful.");
                        sleepCount = 0;
                    }
                }
                // connected + requested, start the cam going
                if( debug ) log.log("Connected and requested! sending STARTCAM");
                try {
                    conversationSocket.sendString(Messages.s_STARTCAM);



                    // client now continuously sends jpgs to us until we drop the connection
                    ByteVector jpg = new ByteVector(MAX_JPG_SIZE);
                    ByteVector header = new ByteVector(MAX_JPG_SIZE);
                    int picCount = 1;
                    while( Connection.getInstance().isRequested() ) {
                        // first get the size of the incoming jpg
                        while( header.searchAsString(Messages.s_SIZEEND) == -1 )
                            header.add(conversationSocket.receive());

                        int endPos = header.searchAsString(Messages.s_SIZEEND);
                        if( endPos + Messages.s_SIZEEND.length() != header.length() ) {
                            // we have some jpg data tacked on the end!
                            if( debug ) log.log("PicCount [" + picCount + "]: Overflow detected on JPG-size receive, of size [" + (header.length() - ( endPos + Messages.s_SIZEEND.length() )) + "]");
                            // copy the overflow into the jpg array
                            jpg = new ByteVector(MAX_JPG_SIZE, header.portion(endPos + Messages.s_SIZEEND.length()));
                        } else {
                            jpg = new ByteVector(MAX_JPG_SIZE);
                        }

                        // get the header
                        String headerStr = new String( header.portionAbsolute( header.searchAsString(Messages.s_CRCSTART) , endPos+Messages.s_SIZEEND.length()-1 ) );
                        int size = Integer.parseInt(headerStr.substring(headerStr.indexOf(Messages.s_SIZESTART) + Messages.s_SIZESTART.length(), headerStr.indexOf(Messages.s_SIZEEND)));
                        int correctCRC = Integer.parseInt(headerStr.substring(headerStr.indexOf(Messages.s_CRCSTART) + Messages.s_CRCSTART.length(), headerStr.indexOf(Messages.s_CRCEND)));

                        while( jpg.length() < size )
                            jpg.add(conversationSocket.receive());

                        // if we've received too much
                        if( jpg.length() > size ) {
                            // take the stuff that's overflow, consider that as data for the next iteration of the loop
                            if( debug ) log.log("PicCount [" + picCount + "]: Overflow detected on JPG-data receive, of size " + (jpg.length()-size));
                            header = new ByteVector(MAX_JPG_SIZE, jpg.portion(size)); // overflow
                        } else {
                            header = new ByteVector(MAX_JPG_SIZE);
                        }
                        byte[] finalJPG = jpg.portionRelative(0, size);
                        int crc = jpg.calcCRC(0, size-1);
                        if( correctCRC != crc ) {
                            if( debug ) log.log("PicCount [" + picCount + "]: Warning, this received jpg failed the CRC! Got CRC [" + crc + "], expected CRC to be [" + correctCRC + "]");
                            FileOutputStream temp = new FileOutputStream("crcfail.jpg");
                            temp.write(finalJPG);
                            temp.flush();
                            temp.close();
                        } else {
                            Connection.getInstance().setCurrentJPG(finalJPG);
                        }
                        picCount +=1;
                    }

                } catch(Exception e) {
                    if( debug ) log.log("Had an exception while receiving JPGs, dropping connection: " + e.getMessage());
                    conversationSocket.close();
                    continue outerLoop;
                }

                // no longer requested - drop connection, client will pick it back up again
                // automatically
                conversationSocket.close();
            }
        } catch(IOException e) {
            log.log("ERROR: caught an unhandled IOException: " + e.getMessage());
        } catch(InterruptedException e) {
            log.log("ERROR: caught an unhandled InterruptedException");
        }
    }

    private boolean pingClient() {
        if( debug )
            log.log("DEBUG: starting to ping client...");
        try {
            conversationSocket.sendString(Messages.s_HELLO);
            if( !conversationSocket.receiveString().equals(Messages.ACK) )
                return false;
        } catch( Exception e ) {
            return false;
        }
        if( debug )
            log.log("DEBUG: ping successful.");
        return true;
    }

    private boolean doKeepAlive() {
        if( debug )
            log.log("DEBUG: sending s_KEEPALIVE...");
        try {
            conversationSocket.sendString(Messages.s_KEEPALIVE);
        } catch( Exception e ) {
            return false;
        }
        return true;
    }

}
