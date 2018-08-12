import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class Dice1 extends Applet implements AdjustmentListener
{
    private Scrollbar die1, die2;
    private int value1 = 1, value2 = 1;

    public void init()
    {
        die1 = new Scrollbar(Scrollbar.HORIZONTAL, 1,1,1,6);
        add(die1);
        die1.addAdjustmentListener(this);
        die2 = new Scrollbar(Scrollbar.HORIZONTAL, 1,1,1,6);
        add(die2);
        die2.addAdjustmentListener(this);
    }

    public void paint(Graphics g)
    {
        int total;
        total = value1 + value2;
        g.drawString("total is " + total, 50, 50);
        if (total == 6)
            g.drawString("you have won!", 50, 70);
        else
            g.drawString("you have lost!", 50, 70);
    }

    public void adjustmentValueChanged(AdjustmentEvent event)
    {
        value1 = die1.getValue();
        value2 = die2.getValue();
        repaint();
    }
}
