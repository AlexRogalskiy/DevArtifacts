// ASSIGNMENT:      5
// EXERCISE:        7.7
// NAME:            Fabien Doiron
// STUDENT #:
// DUE DATE:        Feb 20, 2004
// COURSE CODE:
// PROGRAM:

//this program will create a Rock, Paper, Scissors game
import java.awt.*;
import java.applet.Applet;
import java.awt.event.*;

public class RockGame extends Applet implements ActionListener
{
    //naming the three buttons
    private Button rock;
    private Button paper;
    private Button scissors;
    private int totalgames = 0;
    private int compwins = 0;
    private int playerwins = 0;

    //giving the number of value of the buttons
    private int playerschoice = 0;
    private boolean compchoice = false;

    public void init()
    {
        //creating the rock button
        rock = new Button("Rock");
        add(rock);
        rock.addActionListener(this);

        //creating the paper button
        paper = new Button("Paper");
        add(paper);
        paper.addActionListener(this);

        //creating the scissors button
        scissors = new Button("Scissors");
        add(scissors);
        scissors.addActionListener(this);
    }

    public void paint(Graphics g)
    {
        //identifying the button chosen from the actionPerformed
        if (playerschoice == 1)
            g.drawString("You chose Rock", 50, 100);
        if (playerschoice == 2)
            g.drawString("You chose Paper", 50, 100);
        if (playerschoice == 3)
            g.drawString("You chose Scissors", 50, 100);

        //naming a variable randompick for the computers choice
        int randompick;

        //calculating by random the computers pick
        randompick = (int)(Math.random() * 3) + 1;

        //connecting the random values with the three different options
        if ((randompick == 1) && (compchoice == true))
            g.drawString("The computer chose Rock", 50, 120);
        else
            if ((randompick == 2) && (compchoice == true))
                g.drawString("The computer chose Paper", 50, 120);
            else
                if ((randompick == 3) && (compchoice == true))
                    g.drawString("The computer chose Scissors", 50, 120);

        //comparing the randompic with the playerschoice to determine the winner
        if (randompick == playerschoice)
            g.drawString("It's a draw!! Please try again.", 50, 160);
        if (((randompick == 1) && (playerschoice == 2)) || ((randompick == 2) && (playerschoice == 3)) || ((randompick == 3) && (playerschoice == 1)))
            g.drawString("Congratulations, you WIN!!!", 50, 160);
        if (((randompick == 1) && (playerschoice == 3)) || ((randompick == 2) && (playerschoice == 1)) || ((randompick == 3) && (playerschoice == 2)))
            g.drawString("Sorry, you lose!", 50, 160);

        //calculating the total of wins by the player and the computer
        if (((randompick == 1) && (playerschoice == 2)) || ((randompick == 2) && (playerschoice == 3)) || ((randompick == 3) && (playerschoice == 1)))
            playerwins = playerwins + 1;
        if (((randompick == 1) && (playerschoice == 3)) || ((randompick == 2) && (playerschoice == 1)) || ((randompick == 3) && (playerschoice == 2)))
            compwins = compwins + 1;

        //calculating the winner and by how many games
        if (playerwins == compwins)
            g.drawString("This match is even!", 50, 220);
        if (playerwins > compwins)
            g.drawString("Wow, you are wining the match by  " + (playerwins - compwins), 50, 220);
        if (playerwins < compwins)
            g.drawString("Sorry, but you are losing by  " + (compwins - playerwins), 50, 220);

        //writing the number of total games
        g.drawString("You have played a total of  " + totalgames, 50, 200);
    }

    public void actionPerformed(ActionEvent event)
    {
        //setting the value of playerschoice at 0
        playerschoice = 0;

        //attributing the value of 1, 2, or 3 depending on the button clicked
        if (event.getSource() == rock)
            playerschoice = 1;
        if (event.getSource() == paper)
            playerschoice = 2;
        if (event.getSource() == scissors)
            playerschoice = 3;

        //adding 1 to the total games each time a button is clicked
        totalgames = totalgames + 1;

        //allowing the random number chosen by the computer to be displayed
        compchoice = true;

        repaint();
    }
}
