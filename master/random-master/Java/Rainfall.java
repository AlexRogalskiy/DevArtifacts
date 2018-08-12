// ASSIGNMENT:      2
// EXERCISE:        3.4
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        Jan 30, 2004
// COURSE CODE:
// PROGRAM:

import java.awt.*;
import java.applet.*;

public class Rainfall extends Applet
{
    public void paint(Graphics g)
    {
        // graphic lines
        g.drawLine (100,350,350,350);
        g.drawLine (100,50,100,350);

        // representing the data by horizontal lines
        g.drawLine (100,325,250,325);
        g.drawLine (100,275,275,275);
        g.drawLine (100,225,220,225);

        // inserting numbers alongside the horizontal lines and rectangles
        g.drawString ("1994", 50,330);
        g.drawString ("1995", 50,280);
        g.drawString ("1996", 50,230);
        g.drawString ("1994", 50,180);
        g.drawString ("1995", 50,130);
        g.drawString ("1996", 50,80);

        // inserting the rainfall figures alongside the horizontal lines and rectangles
        g.drawString ("150 cm", 300,330);
        g.drawString ("175 cm", 300,280);
        g.drawString ("120 cm", 300,230);
        g.drawString ("150 cm", 300,180);
        g.drawString ("175 cm", 300,130);
        g.drawString ("120 cm", 300,80);

        // drawing rectangles
        g.drawRect (100,175,150,5);
        g.drawRect (100,125,175,5);
        g.drawRect (100,75,120,5);

        // add color to the rectangles
        g.setColor (Color.red);
        g.fillRect (100,175,151,6);
        g.setColor (Color.blue);
        g.fillRect (100,125,176,6);
        g.setColor (Color.green);
        g.fillRect (100,75,121,6);

    }
}
