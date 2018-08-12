import java.awt.*;
import java.applet.*;

public class Ball extends Applet
{
    private int x = 8, xChange = 7;
    private int y = 3, yChange = 2;
    private int diameter = 10;

    private int rectLeftX = 0, rectRightX = 100;
    private int rectTopY = 0, rectBottomY = 100;

    private long startTime = 0, wait = 0;

    public void paint(Graphics g)
    {
        g.drawRect(rectLeftX, rectTopY, rectRightX - rectLeftX, rectBottomY - rectTopY);

        for (int n = 1; n < 1000; n++)
        {
            startTime = System.currentTimeMillis();
            wait = 0;

            while(wait < 25)
            {
                wait = System.currentTimeMillis() - startTime;
            }

            Color backgroundColour = getBackground();
            g.setColor(backgroundColour);
            g.fillOval(x, y, diameter, diameter);

            if (x <= (rectLeftX + 2))
                xChange = -xChange;
            if (x >= (rectRightX - diameter - 5))
                xChange = -xChange;

            if (y >= (rectTopY + 2))
                yChange = -yChange;
            if (y <= (rectBottomY - diameter - 2))
                yChange = -yChange;

            x = x + xChange;
            y = y + yChange;

            g.setColor(Color.red);
            g.fillOval(x, y, diameter, diameter);
        }
    }
}
