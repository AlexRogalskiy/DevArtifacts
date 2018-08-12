import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class FirstEvent extends Applet implements AdjustmentListener
{
    private Scrollbar slider;
    private int slideValue;
    private int sliderValue = 0;

    public void init()
    {
        slider = new Scrollbar(Scrollbar.HORIZONTAL, 0, 1, 0, 100);
        add(slider);
        slider.addAdjustmentListener(this);
    }

    public void paint(Graphics g)
    {
        g.drawString("Current value is " + sliderValue,100, 100);
    }

    public void adjustmentValueChanged(AdjustmentEvent e)
    {
        sliderValue = slider.getValue();
        repaint();
    }
}
