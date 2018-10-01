//: Playground - noun: a place where people can play

// Coding iPhone Apps for Kids
// Chapter 5 Examples

// Creating Optionals

var grade = 5
var futureTeacher: String?
//You can give an optional a value
futureTeacher = "Ms. Gleason"
// Or you can set an optional to nil
futureTeacher = nil

// You cannot set a non-optional to nil
//grade = nil

// Unwrapping Optionals

futureTeacher = "Mr. Gale"
print("Next year I think my teacher will be \(futureTeacher).")
print("Next year I know my teacher will be \(futureTeacher!).")

futureTeacher = nil
//print("Next year I know my teacher will be \(futureTeacher!).") // Error

if futureTeacher != nil {
    let knownTeacher = futureTeacher!
    print("Next year \(knownTeacher) will be my teacher.")
} else {
    print("I do not know who will be my teacher next year.")
}

if let knownTeacher = futureTeacher {
    print("Next year \(knownTeacher) will be my teacher.")
} else {
    print("I do not know who will be my teacher next year.")
}

// A Special Kind of Operator: ??

let defaultLunch = "pizza"
var specialLunch: String?
var myLunch = specialLunch ?? defaultLunch
print("On Monday I had \(myLunch) for lunch.")
specialLunch = "shepherd's pie"
myLunch = specialLunch ?? defaultLunch
print("Today I had \(myLunch) for lunch.")

