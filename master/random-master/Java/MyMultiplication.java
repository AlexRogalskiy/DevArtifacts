// ASSIGNMENT:      6
// EXERCISE:        8.8
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        March 12, 2004
// COURSE CODE:
// PROGRAM:

//This program creates a multiplication tables like the children use
import java.awt.*;
import java.applet.*;

public class MyMultiplication extends Applet
{
    //creating the variable size of the table
    private int size = 12;

        public void paint(Graphics g)
        {
            //creating and declaring the values of x and y
            int x = 25;
            int y = 20;

            //creating an integer called top and assigning its value
            int top = 1;
            //creating a loop to list the horizontal numbers at the top
            while  (top <= size)
            {
                g.drawString("" + top, x, y);
                x = x + 30;
                top++;
            }

            //setting the value of y
            y = 30;

            //creatiing an integer called left and assigning its value
            int left = 1;
            //creating a loop to list the vertical numbers at the left
            while (left <= size)
            {
                x = 5;
                y = y + 20;
                g.drawString("" + left, x, y);
                left++;
            }

            //setting the value of y
            y = 50;

            //creating a integer count and giving it a value of 1
            int count = 1;

                //starting a while loop with count to repete the for loop
                while (count < (size + 1))
                {
                    //setting the value of x
                    x = -35;

                    //creating a loop that will create the multiplication table
                    for (int table = 1; table < size; table++)
                    {
                        for (int n = 1; n < (size + 2); n++)
                        {
                        x = x + 30;
                        g.drawString("" + table, x, y);
                        table = n * count;
                        }
                    }

                //adding 1 to the variable count
                count++;

                //making the next row of numbers go down 20
                y = y + 20;
                }

    }
}
