package wxpRelay;

import java.util.Date;
import java.io.FileInputStream;
import java.io.File;

/**
 * This is a singleton-pattern class that holds all the information about the connection between the
 * server and the cam-computer. It is synchronized, etc
 */
public class Connection {
    private static Connection instance = null;
    private Logger log;
    private Boolean connected = new Boolean(false);
    private Boolean requested = new Boolean(false);
    private static TimerThread timerThread;
    private byte[] currentJPG;
    private byte[] loadingJPG;
    private boolean isLoadingJPG = true;

    private Connection() {
        log = new Logger("[Connection]");

        // load up the loading.jpg
        try {
            FileInputStream fis = null;
            File file  = new File("../resources", "loading.jpg");
            if (file.exists()) {
                loadingJPG = new byte[(int)file.length()];
                fis    = new FileInputStream(file);
                fis.read(loadingJPG);
                fis.close();
                currentJPG = loadingJPG;
            } else {
                log.log("ERROR: couldn't find loading.jpg.");
                System.exit(-1);
            }
        } catch (Exception e) {
            log.log("ERROR: couldn't find/load loading.jpg.");
            System.exit(-1);
        }


        timerThread = new TimerThread(ControlServer.CAM_TIMEOUT_MILLIS);
        timerThread.setDaemon(false);
        timerThread.start();
    }
    public static Connection getInstance() {
        if( instance == null )
            instance = new Connection();
        return instance;
    }

    public void setCurrentJPG(byte[] jpg) {
        synchronized(currentJPG) {
            if( isLoadingJPG )
                isLoadingJPG = false;
            currentJPG = jpg;
        }
    }

    // returns a copy of the JPG
    public byte[] getCurrentJPG() {
        synchronized(currentJPG) {
            if( isLoadingJPG && ControlServer.debug )
                log.log("returning isLoading image");
            byte[] retval  = new byte[currentJPG.length];
            System.arraycopy(currentJPG, 0, retval, 0, currentJPG.length);
            return(retval);
        }
    }

    public boolean isConnected() {
        synchronized(connected) {
            return connected.booleanValue();
        }
    }

    public void setConnected(boolean b) {
        synchronized(connected) {
            connected = new Boolean(b);
        }
    }

    public boolean isRequested() {
        synchronized(requested) {
            return requested.booleanValue();
        }
    }

    public void setRequested(boolean b) {
        synchronized(requested) {
            timerThread.resetTimer();
            requested = new Boolean(b);
            if( !b ) {
                synchronized(currentJPG) {
                    isLoadingJPG = true;
                    currentJPG = loadingJPG;
                }
            }
        }
    }


    class TimerThread extends Thread {
        private long timeoutInterval = -1;
        private long timeLeft;
        private long lastCheck = -1;
        TimerThread(long timeoutInterval) {
            if( timeoutInterval <= 0 ) {
                log.log("ERROR: TimerThread's timeoutInterval must be greater than zero.");
                System.exit(-1);
            }
            this.timeoutInterval = timeoutInterval;
        }

        public synchronized void resetTimer() {
            timeLeft = timeoutInterval;
            lastCheck = -1;
            // if( ControlServer.debug ) log.log("TimerThread timeoutInterval reset (resetTimer())");
        }

        public void run() {
            if( ControlServer.debug )
                log.log("TimerThread starting...");
            // idea: every time someone says things have been requested, restart the timer
            // when the timer runs out, consider cam to be not requested.
            resetTimer();
            while(true) {
                while( !isRequested() ) {
                    // wtf? can't use a .wait() and .notify(), some stupid thread-owning problem?!
                    try {
                        Thread.sleep(100);
                    } catch( Exception e ) {
                        return;
                    }
                }
                // move the timer along
                long timeRightNow = new Date().getTime();  // get time since epoch in milliseconds
                if( lastCheck == -1 )
                    lastCheck = timeRightNow;
                else
                    timeLeft -= (timeRightNow - lastCheck);

                if( ControlServer.debug ) log.log("Timer updated, timeLeft is now " + timeLeft);

                // we are requested, has the timer run out?
                if( timeLeft <= 0 ) {
                    setRequested(false); // also resets the timer
                    if( ControlServer.debug )
                        log.log("TimerThread has expired requested!");
                } else {
                    try {
                        Thread.sleep(timeLeft);
                    } catch( Exception e ) {
                        return;
                    }
                }
            }
        }
    }

}
