// ASSIGNMENT:      3
// EXERCISE:        5.8
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        Feb 06, 2004
// COURSE CODE:
// PROGRAM:

import java.awt.*;
import java.applet.*;

public class Circlearea extends Applet
{
    public void paint(Graphics g)
    {
        //giving a value to the variable answer
        float answer = areaCircle(1.75f);
        g.drawString("area =" +answer,100,100);
    }

    private float areaCircle(float r)
    {
        //calculating the area with an expression
        float area = (float)Math.PI * r * r;
        return area;
    }
}
