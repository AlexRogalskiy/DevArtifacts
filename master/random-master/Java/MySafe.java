// ASSIGNMENT:      10
// EXERCISE:        13.3
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        April 16, 2004
// COURSE CODE:
// PROGRAM:


//this program creates a safe with a six digit combination
//you will have three chances to figure out the combination or you will have to start over

import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class MySafe extends Applet implements ActionListener
{
    //naming the variables and assigning some values
    Button[] digit = new Button[10];
    int[] right = new int[6];
    int buttonNumber;
    private TextField display;
    private int tries = 0;
    private int correct = 0;

    public void init()
    {
        //creating a loop to create the buttons from an array
        for (int b = 0; b < 10; b++)
        {
            digit[b] = new Button(Integer.toString(b));
            add(digit[b]);
            digit[b].addActionListener(this);
        }

        //assigning the six digits to unlock the safe
        right[0] = 1;
        right[1] = 3;
        right[2] = 5;
        right[3] = 7;
        right[4] = 9;
        right[5] = 0;

        //creates a text field
        display = new TextField(40);
        add(display);
    }

    public void actionPerformed(ActionEvent event)
    {
        //determines which button is pressed
        String buttonCaption = event.getActionCommand();
        buttonNumber = Integer.parseInt(buttonCaption);

        //the following if statements will determine how many tries and if the right button was pressed
        if ((tries < 3) && (buttonNumber == right[correct]))
            {
                display.setText("Unlocked in " + (5 - correct));
                correct++;
            }
            else
            {
                display.setText("sorry, tries left: " + (3 - tries));
                tries++;
            }
            if (tries > 3)
            {
                display.setText("sorry, that is 3 tries.");
                tries = 0;
                correct = 0;
            }
    }

        public void paint(Graphics g)
    {
        //writing the rules of the game
        g.drawString("- The objective of the game is to unlock the safe.", 10, 85);
        g.drawString("- You will get three chances, to unlock the six digits combination.", 10, 105);
        g.drawString("- You will be notified if you picked the right number.", 10, 125);
    }
}
