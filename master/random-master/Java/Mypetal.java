// ASSIGNMENT:      3
// EXERCISE:        Flower
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        Feb 06, 2004
// COURSE CODE:
// PROGRAM:

import java.awt.*;
import java.applet.*;

public class Mypetal extends Applet
{
    public void paint(Graphics g)
    {
        //Use of methods
        //naming the method
        drawFlower(g,100,100,15);
        drawFlower(g,250,250,30);
        drawFlower(g,200,50,5);
        drawFlower(g,450,150,20);
        drawFlower(g,450,350,10);
    }

    public void drawFlower (Graphics g,int xcenter,int ycenter,int radius)
    {
        //setting of the color and drawing of the cirlce
        g.setColor(Color.yellow);
        g.fillOval(xcenter - radius,ycenter - radius,radius * 2,radius * 2);

        //setting the petals color
        g.setColor(Color.green);

        //drawing the right petal
        g.fillOval(xcenter + radius,ycenter - radius,radius * 4,radius * 2);

        //drawing the left petal
        g.fillOval(xcenter - radius - (radius * 4),ycenter - radius,radius * 4,radius * 2);

        //drawing the bottom petal
        g.fillOval(xcenter - radius,ycenter + radius,radius * 2,radius * 4);

        //drawing the top petal
        g.fillOval(xcenter - radius,ycenter - radius - (radius * 4),radius * 2,radius * 4);
    }
}
