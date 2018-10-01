//: Playground - noun: a place where people can play

// Coding iPhone Apps for Kids
// Chapter 8 Examples

// Making a Class

class BirthdayCake {
    let birthdayAge = 8
    let birthdayName = "Jude"
    var feeds = 20
}

let myCake = BirthdayCake()
let age = myCake.birthdayAge
print("My cake is going to need \(age) candles.")
print("The cake will say Happy Birthday \(myCake.birthdayName)!")
print("They say this cake feeds \(myCake.feeds).")
myCake.feeds = 10
print("But really it only feeds \(myCake.feeds).")

//myCake.birthdayName = "Kevin" // Error

// Customizing Each Cake With Initializers

class BirthdayCake_2 {
    let birthdayAge: Int
    let birthdayName: String
    var feeds = 20
    
    init() {
        birthdayAge = 6
        birthdayName = "Dagmar"
        print("\(birthdayName)'s cake is ready!")
    }
    
    init(age: Int, name: String) {
        birthdayAge = age
        birthdayName = name
        print("\(birthdayName)'s cake is ready!")
    }
    
    func message(shouldIncludeAge: Bool) -> String {
        
        if shouldIncludeAge {
            return "Happy \(ordinalAge()) Birthday \(birthdayName)!"
        }
        return "Happy Birthday \(birthdayName)!"
    }
    
    func ordinalAge() -> String {
        var suffix = "th"
        let remainder = birthdayAge % 10
        switch remainder {
        case 1:
            if birthdayAge != 11 {
                suffix = "st"
            }
        case 2:
            if birthdayAge != 12 {
                suffix = "nd"
            }
        case 3:
            if birthdayAge != 13 {
                suffix = "rd"
            }
        default:
            break
        }
        return "\(birthdayAge)" + suffix
    }
}

let newCake = BirthdayCake_2()
newCake.birthdayAge
newCake.birthdayName

let twinsCake = BirthdayCake_2(age: 11, name: "Colin and Brenna")

let brownieCake = BirthdayCake_2(age: 11, name: "Gretchen")
brownieCake.message(shouldIncludeAge: true)

//message(shouldIncludeAge: false) // Error

// A Special Property Called Self

class RocketShip {
    
    var destination: String
    init(destination: String) {
        self.destination = destination
    }
}

let myRocketShip = RocketShip(destination: "Moon")
myRocketShip.destination

