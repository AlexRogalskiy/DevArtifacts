// ASSIGNMENT:      4
// EXERCISE:        6.2
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        Feb 13, 2004
// COURSE CODE:
// PROGRAM:

import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class MyPool extends Applet
    implements AdjustmentListener
{
    //Naming and giving values to the scrollbars
    private Scrollbar slider1, slider2;
    private int slideValue;
    private int slider1Value = 0;
    private int slider2Value = 0;
    //Naming and giving the value of the fixed variables
    private float width = 5.0f;
    private float length = 20.0f;
    //Naming the variables with changing values
    private float averagedepth;
    private float volume;

    public void init()
    {
        //Adding title to the slider1 and setting its values
        Label title1, title2;
        title1 = new Label ("Deep End:");
        add(title1);
        slider1 = new Scrollbar(Scrollbar.HORIZONTAL, 0, 1, 0, 4);
        add(slider1);
        slider1.addAdjustmentListener(this);
        //Adding title to the slider2 and setting its values
        title2 = new Label ("Shallow End:");
        add(title2);
        slider2 = new Scrollbar(Scrollbar.HORIZONTAL, 0, 1, 0, 2);
        add(slider2);
        slider2.addAdjustmentListener(this);
    }

    public void paint(Graphics g)
    {
        //Writing the value of both scrollbars in a phrase
        g.drawString("Deep End is " + slider1Value,100, 100);
        g.drawString("Shallow End is " + slider2Value,100, 150);
        //Calculating the average depth of the pool
        averagedepth = (slider1Value + slider2Value)/2.0f;
        //Calculating the volume of the pool
        volume = averagedepth * width * length;
        //Writing the value of the total volume
        g.drawString("Total Volume is " + volume,100,200);
        //Drawing lines to create the pool
        g.drawLine(50,250,250,250);
        g.drawLine(50,250,50,(250 + (slider1Value * 10)));
        g.drawLine(250,250,250,(250 + (slider2Value * 10)));
        g.drawLine(50,(250 + (slider1Value * 10)),250,(250 + (slider2Value * 10)));
    }

    public void adjustmentValueChanged(AdjustmentEvent e)
    {
        //Attributing the values of the sliders
        slider1Value = slider1.getValue();
        slider2Value = slider2.getValue();
        repaint();
    }
}
