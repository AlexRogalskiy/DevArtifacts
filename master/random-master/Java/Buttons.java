import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class Buttons extends Applet
implements ActionListener
{
    private Button tester;
    private int count = 0;

    public void init()
    {
        tester = new Button("Press Here");
        add(tester);
        tester.addActionListener(this);
    }

    public void actionPerformed(ActionEvent event)
    {
        count++;
        repaint();
    }

    public void paint(Graphics g)
    {
        g.drawString("Number of button presses is " + count, 10, 50);
    }
}
