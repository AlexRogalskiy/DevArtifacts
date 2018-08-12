// ASSIGNMENT:      9
// EXERCISE:        12.5
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        April 7, 2004
// COURSE CODE:
// PROGRAM:

//This program calculates the sum of all integers from 1 to the number entered
import java.awt.*;
import java.applet.*;
import java.awt.event.*;

public class MySum extends Applet implements ActionListener
{
    //defining 3 buttons, 3 text field and a class
    private Button calculate, calculate1, calculate2;
    private TextField nValue, formula, loop;
    private Sum myTotal;

    public void init()
    {
        //defining the label for the value entered
        Label amountLabel = new Label("Enter a value:");
        add(amountLabel);

        //creating a text field for the value
        nValue = new TextField(8);
        add(nValue);
        nValue.addActionListener(this);

        //defining the label for the formula
        Label formulaLabel = new Label ("The sum of the numbers using the formula sum = n(n + 1)/2 is:");
        add(formulaLabel);

        //creating the textfield for the answer using the formula
        formula = new TextField(20);
        add(formula);

        //creating the button to calculate the sum using the formula
        calculate1 = new Button ("Calculate the sum using the formula.");
        add(calculate1);
        calculate1.addActionListener(this);

        //defining the label for the loop
        Label loopLabel = new Label ("The sum of the numbers using a loop is:");
        add(loopLabel);

        //creating the textfield for the answer using a loop
        loop = new TextField(20);
        add(loop);

        //creating the button to calculate the sum using a loop
        calculate2 = new Button ("Calculate the sum using a loop.");
        add(calculate2);
        calculate2.addActionListener(this);

        //creating the button to calculate the sum using both methods
        calculate = new Button ("Calculate the sum using both methods.");
        add(calculate);
        calculate.addActionListener(this);

        myTotal = new Sum();
    }

    public void actionPerformed(ActionEvent event)
    {
        //determining the the value entered and which button is pressed
        //sending the value entered to the class
        if (event.getSource() == nValue)
        {
            int amount = Integer.parseInt(nValue.getText());
            myTotal.setInitialValue(amount);
        }

        //calculating the sum using both methods using value for the text that was sent to the class
        if (event.getSource() == calculate)
        {
            myTotal.calculate();
            int newAmount = myTotal.getNewAmount();
            int number = newAmount;
            formula.setText("" + number);

            int finalAmount = myTotal.getFinalAmount();
            int number2 = finalAmount;
            loop.setText("" + number2);
        }

        //calculating the sum using the formula using the value for the text that was sent to the class
        if (event.getSource() == calculate1)
        {
            myTotal.calculated();
            int newAmount = myTotal.getNewAmount();
            int number = newAmount;
            formula.setText("" + number);
        }

        //calculating the sum using the loop using the value for the text that was sent to the class
        if (event.getSource() == calculate2)
        {
            myTotal.calculating();
            int finalAmount = myTotal.getFinalAmount();
            int number2 = finalAmount;
            loop.setText("" + number2);
        }
    }
}

//starting the class
class Sum
{
    //defining variables
    private int oldAmount, otherAmount, newAmount, finalAmount, totalAmount;

    public void setInitialValue(int amount)
    {
        //assigning the value entered in the text field to two variables to be used in the class
        oldAmount = amount;
        otherAmount = amount;
    }

    public void calculate()
    {
        //calculation used in the formula
        newAmount = oldAmount * (oldAmount + 1) / 2;
        oldAmount = newAmount;

        //calculation used in the loop
        int count = 0;
        int mid = 0;
        while (count < otherAmount)
        {
            totalAmount = mid + (count + 1);
            mid = totalAmount;
            finalAmount = mid;
            count++;
        }
    }

    public void calculating()
    {
        //calculation used in the loop
        int count = 0;
        int mid = 0;
        while (count < otherAmount)
        {
            totalAmount = mid + (count + 1);
            mid = totalAmount;
            finalAmount = mid;
            count++;
        }
    }

    public void calculated()
    {
        //calculation used in the formula
        newAmount = oldAmount * (oldAmount + 1) / 2;
        oldAmount = newAmount;
    }

    public int getNewAmount()
    {
        //the final value for the formula
        return newAmount;
    }

    public int getFinalAmount()
    {
        //the final value for the loop
        return finalAmount;
    }
}
