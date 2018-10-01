#RockPaperScissors.py
import random
choices = ["rock", "paper", "scissors"]
print("Rock crushes scissors. Scissors cut paper. Paper covers rock.")
player = input("Do you want to be rock, paper, or scissors (or quit)? ")
while player != "quit":                 # Keep playing until the user quits
    player = player.lower()             # Change user entry to lowercase
    computer = random.choice(choices)   # Pick one of the items in choices
    print("You chose " +player+ ", and the computer chose " +computer+ ".")
    if player == computer:
        print("It's a tie!")
    elif player == "rock":
        if computer == "scissors":
            print("You win!")
        else:
            print("Computer wins!")
    elif player == "paper":
        if computer == "rock":
            print("You win!")
        else:
            print("Computer wins!")
    elif player == "scissors":
        if computer == "paper":
            print("You win!")
        else:
            print("Computer wins!")
    else:
        print("I think there was some sort of error...")
    print()                             # Skip a line
    player = input("Do you want to be rock, paper, or scissors (or quit)? ")


