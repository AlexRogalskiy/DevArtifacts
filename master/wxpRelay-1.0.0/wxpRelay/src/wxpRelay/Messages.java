package wxpRelay;

/**
 * Some messages that can pass over the control connection
 */
public class Messages {
    public static final int BUFFER_SIZE = 1024;

    public final static String s_HELLO = "<>HELLO<>";
    public final static String ACK = "<>ACK<>";
    public final static String s_KEEPALIVE = "<>KEEPALIVE<>";
    public final static String s_STARTCAM = "<>STARTCAM<>";
    public final static String s_SIZESTART = "<>SIZESTART<>";
    public final static String s_SIZEEND = "<>SIZEEND<>";
    public final static String s_CRCSTART = "<>CRCSTART<>";
    public final static String s_CRCEND = "<>CRCEND<>";
}
