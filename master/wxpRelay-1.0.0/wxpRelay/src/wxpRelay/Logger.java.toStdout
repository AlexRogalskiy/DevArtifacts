package wxpRelay;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.Date;

public class Logger {
    private String prefix = null;

    public Logger(String prefix) {
        this.prefix = prefix;
    }
    public void log(String s) {
        Date now = new Date();
        out(now.toString() + " - " + prefix + " - " + s);
    }

    private synchronized static void out(String s) {
        System.out.println(s);
    }
}
