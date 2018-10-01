//: Playground - noun: a place where people can play

// Coding iPhone Apps for Kids
// Chapter 8 Examples

// Value Types and Reference Types

var myAge = 14
var yourAge = myAge
print("My age is \(myAge) and your age is \(yourAge)")
yourAge = 15
print("Now my age is \(myAge) and your age is \(yourAge)")

class Kid {
    var age: Int
    init(age: Int) {
        self.age = age
    }
}

var finn = Kid(age: 9)
var nathan = finn
print("Nathan is \(nathan.age) and Finn is \(finn.age)")
nathan.age = 10
print("Now Nathan is \(nathan.age) and Finn is also \(finn.age)")

// Using Structs

struct Couch {
    var numberOfCushions = 3
    func description() -> String {
        return "This couch has \(numberOfCushions) cushions."
    }
}

var myFirstCouch = Couch()
var mySecondCouch = myFirstCouch
myFirstCouch.description()
mySecondCouch.description()
mySecondCouch.numberOfCushions = 4
myFirstCouch.description()
mySecondCouch.description()