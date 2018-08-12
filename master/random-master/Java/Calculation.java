import java.awt.*;
import java.applet.*;

public class Calculation extends Applet
{
    public void paint(Graphics g)
    {
        int length; // declarations
        int breadth;
        int area;

        length=20; // Assignments
        breadth=10;
        area = length * breadth; // * Means multiply

        g.drawString("Area is "+ area, 100, 100); // Displays answer
    }
}
