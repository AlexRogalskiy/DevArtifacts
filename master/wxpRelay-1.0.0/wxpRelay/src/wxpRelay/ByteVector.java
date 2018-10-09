package wxpRelay;

import sun.misc.CRC16;

/**
 * Created by IntelliJ IDEA.
 * User: Tim Carr
 * Date: Jan 31, 2005
 * Time: 3:48:52 PM
 * To change this template use File | Settings | File Templates.
 */
public class ByteVector {
    private byte[] v;
    private int index;  // the *next unused (writeable)* index: use THEN increment.
    private int maxSize;

    public ByteVector(int max) {
        maxSize = max;
        v = new byte[maxSize];
        index = 0;
    }

    public ByteVector(int max, byte[] n) {
        maxSize = max;
        v = new byte[maxSize];
        System.arraycopy(n, 0, v, 0, n.length);
        index = n.length;
    }

    public int length() {
        return index;
    }

    public byte at(int i) {
        if( i >= v.length || i < 0 )
            throw new ArrayIndexOutOfBoundsException("Array index out of bounds.(tim1)");
        return v[i];
    }

    public void add(byte b) {
        if( index + 1 >= maxSize )
            throw new ArrayIndexOutOfBoundsException("Array index out of bounds.(tim2)");
        addInt(b);
    }

    private void addInt(byte b) {
        v[index] = b;
        index += 1;
    }

    public void add(byte[] b) {
        if( index + b.length >= maxSize )
            throw new ArrayIndexOutOfBoundsException("Array index out of bounds.(tim3)");
        for( int i=0 ; i < b.length ; i+=1 )
            addInt(b[i]);
    }

    public int searchAsString(String s) {
        String full = new String(v, 0, index);
        return full.indexOf(s);
    }

    /**
     * Returns a portion of the byte array, use if you know the absolute positions of beginning and end
     * @param beginPos The first byte you want returned, absolute position from the beginning
     * @param endPos The last byte you want returned, absolute position from the beginning
     * @return
     */
    public byte[] portionAbsolute(int beginPos, int endPos) {
        if( beginPos < 0 || endPos >= index )
            throw new ArrayIndexOutOfBoundsException("Array index out of bounds.(tim4)");
        byte[] retval = new byte[(endPos-beginPos)+1];
        System.arraycopy(v, beginPos, retval, 0, (endPos-beginPos)+1);
        return retval;
    }

    /**
     * Returns a portion of the byte array, use if you know the absolute positions of beginning and the number of bytes you want
     * @param beginPos The first byte you want returned, absolute position from the beginning
     * @param length The number of bytes you want
     * @return
     */
    public byte[] portionRelative(int beginPos, int length) {
        if( beginPos < 0 || beginPos+length > index )
            throw new ArrayIndexOutOfBoundsException("Array index out of bounds.(tim5)");
        byte[] retval = new byte[length];
        System.arraycopy(v, beginPos, retval, 0, length);
        return retval;
    }

    public byte[] portion(int beginPos) {
        return(portionAbsolute(beginPos, index-1));
    }

    public int calcCRC() {
        return(calcCRC(0, index-1));
    }

    /**
     * calculate a crc16
     * @param beginPos the first position to be included in the crc
     * @param endPos the last position to be included in the crc
     * @return a short crc 16 integer
     */
    public int calcCRC(int beginPos, int endPos) {
        if( beginPos < 0 || endPos >= index )
            throw new ArrayIndexOutOfBoundsException("Array index out of bounds.(tim6)");
        CRC16 crc = new CRC16();
        for( int i=beginPos ; i <= endPos ; i+=1 )
            crc.update(v[i]);
        return crc.value;
    }
}
