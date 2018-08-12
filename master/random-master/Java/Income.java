// ASSIGNMENT:      2
// EXERCISE:        4.5
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        Jan 30, 2004
// COURSE CODE:
// PROGRAM:

import java.awt.*;
import java.applet.*;

public class Income extends Applet
{
    public void paint(Graphics g)
    {
        // entering the variables
        int income, deducted, amount, percentage;

        // giving values to the variables
        income = 100000;
        percentage = 5;

        // calculating the values of deducted and amount
        deducted = income / percentage;
        amount = income - deducted;

        // displaying the results
        g.drawString ("Before Taxes: " + income, 10, 30);
        g.drawString ("Deductions: " + deducted, 10, 50);
        g.drawString ("Take Home Pay: " + amount, 10, 70);
    }
}
