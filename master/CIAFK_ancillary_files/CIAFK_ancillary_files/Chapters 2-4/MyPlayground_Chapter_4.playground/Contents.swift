//: Playground - noun: a place where people can play

// Coding iPhone Apps for Kids
// Chapter 4 Examples

import Foundation


// Looping Through Ranges and Collections with for-in

// Say Hello!

for number in 1...4 {
    print("Hello, my name is Colin.") // Use your own name here!
    print("And the value of number is now \(number).\n")
}

// Say Good Morning!

let kidsInClass = ["Gretchen", "Kristina", "Jimmy", "Marcus", "Helen", "Eric", "Alex"]

for kidsName in kidsInClass {
    print("Good Morning \(kidsName)!")
}

// Guess My Number

let numberIAmThinkingOf = 7
var currentGuess = -1

print("Thinking of a number between 1 and 20. Guess what it is.")

while currentGuess != numberIAmThinkingOf {
    
    // Guessing a random number
    currentGuess = Int(arc4random_uniform(20)) + 1
    print("Hmmm... let me guess. Is it \(currentGuess)?")
}

// The right answer
print("You guessed my number! The correct guess was \(currentGuess)!")

// Shrink Away

var shrinking = "Help! I'm shrinking away!"

repeat {
    print(shrinking)
    shrinking = String(shrinking.characters.dropLast())
}

while shrinking.characters.count > 0

// Nesting Blocks of Code

for count in 1...10 {
    // NEST A
    if count % 2 == 0 {
        // NEST B
        var starString = ""
        for starCount in 1...count {
            // NEST C
            starString += "*"
        }
        print(starString)
    } else {
        // NEST D
        var dashString = ""
        for dashCount in 1...count {
            // NEST E
            dashString += "-"
        }
        print(dashString)
    }
}

let isMorning = true
var greeting = ""

if isMorning {
    greeting = "Good Morning"
} else {
    greeting = "Good Afternoon"
}
print(greeting)
