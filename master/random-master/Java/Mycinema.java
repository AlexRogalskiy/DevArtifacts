// ASSIGNMENT:      5
// EXERCISE:        7.4
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        Feb 20, 2004
// COURSE CODE:
// PROGRAM:

//this program calculates what price range you fall in depending on your age

import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class Mycinema extends Applet implements ActionListener
{
    //naming the variables
    private TextField ageField;
    private int age;

    public void init()
    {
        //naming the Label and creating it
        Label ageis = new Label("Your age is:");
        add(ageis);
        //creating the text field
        ageField = new TextField(10);
        add(ageField);
        ageField.addActionListener(this);
    }

    public void actionPerformed(ActionEvent event)
    {
        //processing the integer placed in the text field
        age = Integer.parseInt(ageField.getText());
        repaint();
    }

    public void paint(Graphics g)
    {
        //making the calculations of what price range you will fall in
        g.drawString("Age is " + age, 20, 50);
        if (age < 5)
            g.drawString("You may get in for free!", 100, 50);
        else
            if ((age >= 5) && (age < 13))
                g.drawString("You pay only half price!", 100, 50);
            else
                if ((age >= 13) && (age < 55))
                    g.drawString("Sorry, but adults have to pay full price.", 100, 50);
                else
                    g.drawString("You may get in for free!", 100, 50);
    }
}
