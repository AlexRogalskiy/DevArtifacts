import java.awt.*;
import java.applet.*;

public class MyCircle extends Applet
{
    public void paint(Graphics g)
    {
        circle(g,100,100,50);
    }

    private void circle(Graphics g,int x,int y, int r)
    {
        g.drawOval(x-r,y-r,r*2,r*2);
    }
}
