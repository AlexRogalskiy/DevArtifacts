// ASSIGNMENT:      7
// EXERCISE:        9.1
// NAME:                Fabien Doiron
// STUDENT #:
// DUE DATE:        March 19, 2004
// COURSE CODE:
// PROGRAM:

//This program creates a balloon
//The balloon will move up and down by the use of buttons
//The balloon will grow, shrink and change from red to green all with the use of buttons

import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class PlayBalloon extends Applet implements ActionListener
{
    //Defining the variables for the buttons and the class
    private Button grow, shrink, up, down, red, green;
    private Balloon myBalloon;

    public void init()
    {
        //Creating all the buttons
        grow = new Button ("Grow");
        add(grow);
        grow.addActionListener(this);

        shrink = new Button ("Shrink");
        add(shrink);
        shrink.addActionListener(this);

        up = new Button ("Up");
        add(up);
        up.addActionListener(this);

        down = new Button ("Down");
        add(down);
        down.addActionListener(this);

        red = new Button ("Make Red");
        add(red);
        red.addActionListener(this);

        green = new Button ("Make Green");
        add(green);
        green.addActionListener(this);

        //Defining the original size of the balloon and its position
        myBalloon = new Balloon(20, 50, 50);
    }

    public void actionPerformed(ActionEvent event)
    {
        //Determining which button is pressed and sends the result in the class
        if (event.getSource() == grow)
            myBalloon.changeSize(10);
        if (event.getSource() == shrink)
            myBalloon.changeSize(-10);
        if (event.getSource() == up)
            myBalloon.up();
        if (event.getSource() == down)
            myBalloon.down();
        if (event.getSource() == red)
            myBalloon.changeColor(0);
        if (event.getSource() == green)
            myBalloon.changeColor(1);
        repaint();
    }

    public void paint(Graphics g)
    {
        //Drawing the class myBalloon
        myBalloon.display(g);
    }
}

//Starting the class
class Balloon
{
    //Defining integer and variables
    private int diameter;
    private int color = 0;
    private int xCoord, yCoord;

    public Balloon(int initialDiameter, int initialX, int initialY)
    {
        //Defining variable and assignment its value
        diameter = initialDiameter;
        xCoord = initialX;
        yCoord = initialY;
    }

    public void changeSize(int change)
    {
        //Changing the size of the balloon when the grow and shrink buttons are pressed
        diameter = diameter + change;
    }

    public void up()
    {
        //Moving the balloon up
        yCoord = yCoord - 10;
    }

    public void down()
    {
        //Moving the balloon down
        yCoord = yCoord + 10;
    }

    public void changeColor(int initialcolor)
    {
        //Setting the color to red
        color = initialcolor;
    }

    public void display(Graphics g)
    {
        //Determining what color the balloon will be from the button clicked
        if (color == 0)
            g.setColor(Color.red);
        if (color == 1)
            g.setColor(Color.green);
        g.fillOval(xCoord, yCoord, diameter, diameter);

        //Resetting the text color to black and having "My Balloon" follow the balloon
        g.setColor(Color.black);
        g.drawString("My Balloon", xCoord + 10, yCoord + diameter + 20);
    }
}
