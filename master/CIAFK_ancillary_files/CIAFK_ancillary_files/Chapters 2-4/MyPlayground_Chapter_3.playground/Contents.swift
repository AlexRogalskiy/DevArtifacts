//: Playground - noun: a place where people can play

// Coding iPhone Apps for Kids
// Chapter 3 Examples

import UIKit


// Boolean Expressions

3 + 2 == 5
4 + 5 == 8
3 != 5
4 + 5 != 8
// This is wrong and will give you an error
//3 + 5 = 8

// Comparing strings
let myName = "Gloria"
myName == "Melissa"
myName == "Gloria"
myName == "gloria"

var myHeight = 67.5
myHeight == 67.5

// This is wrong and will give you an error
//myHeight == myName

// Greater than
9 > 7
// Less than
9 < 11
// Greater than or equal to
3 + 4 >= 7
3 + 4 > 7
// Less than or equal to
5 + 6 <= 11
5 + 6 < 11

var age = 12
age > 10 && age < 15

age = 18
age > 10 && age < 15

let name = "Jacqueline"
name == "Jack"
name == "Jack" || name == "Jacqueline"

let isAGirl = true
!isAGirl && name == "Jack"
isAGirl && name == "Jacqueline"
(!isAGirl && name == "Jack") || (isAGirl && name == "Jacqueline")


// Conditional Statements

let heightToRideAlone = 48.0
var height = 49.5

if height >= heightToRideAlone {
    print("You are tall enough to ride this roller coaster.")
} else {
    print("Sorry. You cannot ride this roller coaster.")
}

let heightToRideWithAdult = 36.0
height = 47.5

if height >= heightToRideAlone {
    print("You are tall enough to ride this roller coaster.")
} else if height >= heightToRideWithAdult {
    print("You can ride this roller coaster with an adult.")
} else {
    print("Sorry. You cannot ride this roller coaster.")
}

var studentGrade = 5
var studentProject = "To be determined"

switch studentGrade {
case 1:
    studentProject = "A country of the student's choice"
case 2:
    studentProject = "The Iditarod"
case 3:
    studentProject = "Native Americans"
case 4:
    studentProject = "A state of the student's choice"
case 5:
    studentProject = "Colonial times"
case 6, 7, 8:
    studentProject = "Student's choice"
default:
    studentProject = "N/A"
}
