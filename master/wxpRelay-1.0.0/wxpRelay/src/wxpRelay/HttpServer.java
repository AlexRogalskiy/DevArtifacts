package wxpRelay;

import java.net.ServerSocket;
import java.net.Socket;
import java.io.*;

/**
 * Given a port number, runs an extremely basic http server on the port, taking incoming connections
 * and feeding them the JPG
 */
public class HttpServer extends Thread {
    private ServerSocket serverSocket;
    private Logger log = null;
    private boolean debug;
    private byte[] offlineJPG;
int crapCounter=1;

    public HttpServer(int port, boolean debug) {
        this.debug = debug;
        log = new Logger("[HttpServer:" + port + "]");

        // load up the offline.jpg
        try {
            FileInputStream fis = null;
            File file  = new File("../resources", "offline.jpg");
            if (file.exists()) {
                offlineJPG = new byte[(int)file.length()];
                fis    = new FileInputStream(file);
                fis.read(offlineJPG);
            } else {
                log.log("ERROR: couldn't find offline.jpg.");
                System.exit(-1);
            }
        } catch (Exception e) {
            log.log("ERROR: couldn't find/load offline.jpg.");
            System.exit(-1);
        }

        try {
            serverSocket = new ServerSocket(port);
        } catch (IOException e) {
            log.log("ERROR: couldn't make serverSocket on port [" + port + "]");
        }
    }

    public void run() {
        try {
            while( true ) {
                Socket thisSocket = serverSocket.accept();
                Thread nextThread = new HttpThread(thisSocket);
                nextThread.setDaemon(false);
                nextThread.start();
            }
        } catch(IOException e) {
            log.log("ERROR: caught an IOException: " + e.getMessage());
        }
    }

    class HttpThread extends Thread {
        private Socket s;

        HttpThread( Socket sock ) {
            s = sock;
        }

        public void run() {
            try {
                // notify Connection that we have someone requesting (start gathering cam video!)
                Connection.getInstance().setRequested(true);
                if( !Connection.getInstance().isConnected() ) {
                    // if this is the first request, wait half a sec first
                    Thread.sleep(500);
                }

                byte[] sendJPG;
                String contentLengthStr;
                if( Connection.getInstance().isConnected() ) {
                    sendJPG = Connection.getInstance().getCurrentJPG(); // get makes a new byte[]
                    contentLengthStr = new String("Content-Length: " + sendJPG.length + "\r\n\r\n");
                } else {
                    // send the offline jpg
                    sendJPG = offlineJPG;
                    contentLengthStr = new String("Content-Length: " + offlineJPG.length + "\r\n\r\n");
                    if( debug ) log.log("Sending offline JPG...");
                }

                // first receive some junk
                byte temp[] = new byte[2*Messages.BUFFER_SIZE];
                StringBuffer sb = new StringBuffer(2*Messages.BUFFER_SIZE);
                int received = s.getInputStream().read(temp);
                sb.append(new String(temp, 0, received));
                //if( debug ) log.log("DEBUG: Incoming request, request received: " + sb);

                // now send the jpg
                PrintWriter out   = new PrintWriter( s.getOutputStream() );
                // http header stuff - content-length still needs to be added
                out.print(
                        "HTTP/1.1 200 OK\r\n" +
                        "Server: wxpRelay\r\n" +
                        "Date: Sun, 1 Jan 2006 01:00:00 GMT\r\n" +
                        "Content-Type: image/jpeg\r\n" +
                        "Last-Modified: Tue, 25 Jan 2005 16:18:25 GMT\r\n" +
                        "Connection: keep-alive\r\n" +
                        "Cache-control: no-cache, must revalidate\r\n" +
                        "Expires: Tue, 25 Jan 2005 16:18:25 GMT\r\n" +
                        "Pragma: no-cache\r\n" +
                        contentLengthStr
                );

                out.flush();
                s.getOutputStream().write(sendJPG);
                s.close();
            } catch( Exception e ) {
                log.log("ERROR: exception in HttpThread.run(): " + e.getMessage());
            }
        }
    }
}
