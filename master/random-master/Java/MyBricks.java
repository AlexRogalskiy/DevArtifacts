// ASSIGNMENT:      8
// EXERCISE:        9.2
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        March 26, 2004
// COURSE CODE:
// PROGRAM:

//This program creates a brick
//The brick will move left and right by the use of buttons
//The brick will grow and shrink with the use of buttons

import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class MyBricks extends Applet implements ActionListener
{
    //Defining the variables for the buttons and the class
    private Button grow, shrink, left, right, rotate;
    private Brick myBricks;

    public void init()
    {
        //Creating all the buttons
        grow = new Button ("Grow");
        add(grow);
        grow.addActionListener(this);

        shrink = new Button ("Shrink");
        add(shrink);
        shrink.addActionListener(this);

        left = new Button ("Left");
        add(left);
        left.addActionListener(this);

        right = new Button ("Right");
        add(right);
        right.addActionListener(this);

        rotate = new Button ("Rotate");
        add(rotate);
        rotate.addActionListener(this);

        //Defining the original size of the brick and its position
        myBricks = new Brick(20, 50, 100, 40);
    }

    public void actionPerformed(ActionEvent event)
    {
        //Determining which button is pressed and sends the result in the class
        if (event.getSource() == grow)
            myBricks.grow();
        if (event.getSource() == shrink)
            myBricks.shrink();
        if (event.getSource() == left)
            myBricks.left();
        if (event.getSource() == right)
            myBricks.right();
        if (event.getSource() == rotate)
            myBricks.rotate();
        repaint();
    }

    public void paint(Graphics g)
    {
        //Drawing the class myBrick
        myBricks.display(g);
    }
}

//Starting the class
class Brick
{
    //Defining integer and variables
    private int x;
    private int y;
    private int width;
    private int height;
    private int rotatewidth = 100;
    private int rotatenum;

    public Brick(int initialX, int initialY, int initialWidth, int initialHeight)
    {
        x = initialX;
        y = initialY;
        width = initialWidth;
        height = initialHeight;
    }

    public void grow()
    {
        //Changing the size of the brick
        //Making it bigger
        width = width + 20;
        height = height + 8;
    }

        public void shrink()
    {
        //Changing the size of the brick
        //Making it smaller
        width = width - 20;
        height = height - 8;
    }

    public void left()
    {
        //Moving the brick left
        x = x - 20;
    }

    public void right()
    {
        //Moving the brick right
        x = x + 20;
    }

    public void rotate()
    {
        //Making the brick rotate
        rotatenum = width;
        width = height;
        height = rotatenum;

    }
        public void display(Graphics g)
    {
        //Setting the color of the brick red
        g.setColor(Color.red);
        g.fillRect(x, y, width, height);
    }
}
