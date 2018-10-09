package wxpRelay;

/**
 * Created by IntelliJ IDEA.
 * User: Tim Carr
 * Date: Jan 25, 2005
 * Time: 4:46:29 PM
 * To change this template use File | Settings | File Templates.
 */
public class ServerMain {
    public static void main(String args[]) {
        Logger log = new Logger("[ServerMain]");
        try {
            if( args.length != 3 ) {
                throw new Exception();
            }
            HttpServer server = new HttpServer(Integer.parseInt(args[0]), Boolean.valueOf(args[2]).booleanValue());
            server.setDaemon(false);
            server.start();

            ControlServer ctrlServer = new ControlServer(Integer.parseInt(args[1]), Boolean.valueOf(args[2]).booleanValue());
            ctrlServer.setDaemon(false);
            ctrlServer.start();

        } catch(Exception e) {
            log.log("Server Usage: [serverPort] [controlPort] [debug]\n" +
                    "... where:\n" +
                    "\tserverPort\tThe port to put the HTTP server that services jpg requests on\n" +
                    "\tcontrolPort\tThe port to put the control server that talks to the cam-computer on\n" +
                    "\tdebug\ttrue or false, turns on debugging info"
            );
            System.exit(-1);
        }
    }
}
