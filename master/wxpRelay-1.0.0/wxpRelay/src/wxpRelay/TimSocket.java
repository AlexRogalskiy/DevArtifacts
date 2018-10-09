package wxpRelay;

import java.net.Socket;
import java.net.SocketAddress;
import java.io.IOException;

/**
 * Created by IntelliJ IDEA.
 * User: Tim Carr
 * Date: Jan 25, 2005
 * Time: 10:20:14 PM
 * To change this template use File | Settings | File Templates.
 */
public class TimSocket {
    private Socket socket;

    public TimSocket(Socket s) {
        socket = s;
    }
    public void sendString(String s) throws IOException {
        socket.getOutputStream().write(s.getBytes());
        socket.getOutputStream().flush();
    }

    // blocks until it can receive something!
    public String receiveString() throws IOException {
        byte temp[] = new byte[Messages.BUFFER_SIZE];
        int received = socket.getInputStream().read(temp);
        if( received > 0 )
            return(new String(temp, 0, received));
        else
            throw new IOException("received was <=0 (end of stream) in receiveString()");
    }

    // blocks until it can receive, returns a full byte[]
    public byte[] receive() throws IOException {
        byte temp[] = new byte[Messages.BUFFER_SIZE];
        int received = socket.getInputStream().read(temp);
        if( received <= 0 ) {
            throw new IOException("received was <=0 (end of stream) in receiveString()");
        } else if( received == Messages.BUFFER_SIZE ) {
            return temp;
        } else {
            // return a full smaller-sized byte array
            byte retval[] = new byte[received];
            System.arraycopy(temp, 0, retval, 0, received);
            return retval;
        }
    }

    // sends a byte array
    public void send(byte[] bytes) throws IOException {
        socket.getOutputStream().write(bytes);
        socket.getOutputStream().flush();
    }

    public void connect(SocketAddress addr, int timeout) throws IOException {
        socket.connect(addr, timeout);
    }

    public boolean isConnected() {
        return(socket.isConnected());
    }

    public void close() {
        try {
            socket.close();
        } catch( IOException e ) {}
    }
}
