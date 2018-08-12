// ASSIGNMENT:      9
// EXERCISE:        12.9
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        April 7, 2004
// COURSE CODE:
// PROGRAM:

//This program will create 3 text field in which values can be entered to create a triangle
//The values will calculate the area of the defined triangle

import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class TriangleArea extends Applet implements ActionListener
{
    //creating a button, 4 text field and a class
    private Button calculate;
    private TextField a, b, c, answer;
    private Area myTriangle;

    public void init()
    {
        //defining the main label
        Label allSide = new Label("Enter values for each side of the triangle:");
        add(allSide);

        //defining the label for the first side
        Label firstSide = new Label("a:");
        add(firstSide);

        //creating the text field for the first value
        a = new TextField(3);
        add(a);
        a.addActionListener(this);

        //defining the label for the second side
        Label secondSide = new Label ("b:");
        add(secondSide);

        //creating the text field for the second value
        b = new TextField(3);
        add(b);
        b.addActionListener(this);

        //defining the label for the third side
        Label thirdSide = new Label ("c:");
        add(thirdSide);

        //creating the text field for the third value
        c = new TextField(3);
        add(c);
        c.addActionListener(this);

        //creating the button that will calculate the area of the triangle
        calculate = new Button ("Calculate the area");
        add(calculate);
        calculate.addActionListener(this);

        //defining the label for the answer
        Label loopLabel = new Label ("The area for the specified triangle is:");
        add(loopLabel);

        //creating the text field for the final answer
        answer = new TextField(32);
        add(answer);

        myTriangle = new Area();
    }

    public void actionPerformed(ActionEvent event)
    {
        //determing the values entered in each text field
        if (event.getSource() == a)
        {
            int one = Integer.parseInt(a.getText());
            myTriangle.setAValue(one);
        }

        if (event.getSource() == b)
        {
            int two = Integer.parseInt(a.getText());
            myTriangle.setBValue(two);
        }

        if (event.getSource() == c)
        {
            int three = Integer.parseInt(a.getText());
            myTriangle.setCValue(three);
        }

        //calculating the area using values from the text field
        //the values from the text field go through the class first
        if (event.getSource() == calculate)
        {
            myTriangle.calculate();
            int ans = myTriangle.getNewAmount();
            int number = ans;
            if (number == 0)
            {
                answer.setText("The values entered will not create a triangle.");
            }
                else
                    if (number > 0)
                    {
                        answer.setText("" + number);
                    }
        }
    }
}

//start of the class
class Area
{
    private int aAmount, bAmount, cAmount, sValue, finalArea;

    //getting the value from the first text field and assigning it to the variable aAmount
    public void setAValue(int one)
    {
        aAmount = one;
    }

    //getting the value from the second text field and assigning it to the variable bAmount
    public void setBValue(int two)
    {
        bAmount = two;
    }

    //getting the value from the third text field and assigning it to the variable cAmount
    public void setCValue(int three)
    {
        cAmount = three;
    }

    //determining if the values will form a triangle
    public void calculate()
    {
        if (aAmount + bAmount < cAmount)
            finalArea = 0;
        else
            if (bAmount + cAmount < aAmount)
                finalArea = 0;
        else
            if (aAmount + cAmount < bAmount)
                finalArea = 0;

                else
                {
                    sValue = (aAmount + bAmount + cAmount)/2;
                    finalArea = (int) Math.sqrt(sValue * (sValue - aAmount) * (sValue - bAmount) * (sValue - cAmount));
                }
    }

    //returns the value of finalArea in the event of the button
    public int getNewAmount()
    {
        return finalArea;
    }
}
