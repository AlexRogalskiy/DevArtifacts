//: Playground - noun: a place where people can play

// Coding iPhone Apps for Kids
// Chapter 7 Examples

print("Swift is awesome!")

// Writing a Custom Function

func printAHaiku() {
    print("Input and output,")
    print("This function needs neither one")
    print("To print a haiku")
}

printAHaiku()

// Functions Do Even More with Input Parameters

func invite(guest: String) {
    print("Dear \(guest),")
    print("I'd love for you to come to my birthday party!")
    print("It's going to be this Saturday at my house.")
    print("I hope that you can make it!")
    print("Love, Brenna\n")
}

invite(guest: "Cathy")
invite(guest: "Meghan")
invite(guest: "Maddie")

func invite(allGuests: [String]) {
    for guest in allGuests {
        invite(guest: guest)
    }
}

let friends = ["Cathy", "Meghan", "Maddie", "Julia", "Sophie", "Asher"]
invite(allGuests: friends)

func sendMessage(guest: String, rsvped: Bool) {
    
    print("Dear \(guest),")
    
    if rsvped {
        print("I'm so excited to see you this weekend!")
    } else {
        print("I hope that you can make it to my party.")
        print("Can you let me know by tomorrow?")
    }
    print("We will have a huge slip and slide, so bring your bathing suit!")
    print("Love, Brenna\n")
}

sendMessage(guest: "Julia", rsvped: true)
sendMessage(guest: "Asher", rsvped: false)

// Adding a Custom Argument Label

func sendThankYou(to guest: String, for gift: String) {
    print("Dear \(guest),")
    print("Thanks for coming to my party and for the \(gift).")
    print("It was so great to see you!")
    print("Love, Brenna\n")
}

sendThankYou(to: "Meghan", for: "puzzle books")
// This will not work
//sendThankYou(guest: "Meghan", gift: "puzzle books") // Error

// Removing an Argument Label

func volumeOfBoxWithSides(_ side1: Int, _ side2: Int, _ side3: Int) {
    print("The volume of this box is \(side1 * side2 * side3).")
}

volumeOfBoxWithSides(3, 4, 6)

// Return Values

func volumeOfBox(_ side1: Int, _ side2: Int, _ side3: Int) -> Int {
    let volume = side1 * side2 * side3
    return volume
}

let volumeOfBox1 = volumeOfBox(6, 5, 3)
let volumeOfBox2 = volumeOfBox(8, 4, 2)

if volumeOfBox1 > volumeOfBox2 {
    print("Box 1 is the bigger box.")
    
} else if volumeOfBox1 < volumeOfBox2 {
    print("Box 2 is the bigger box.")
    
} else {
    print("The boxes are the same size.")
}

// Conditional Returns

func averageOf(_ scores:[Int]) -> Int {
    
    var sum = 0
    for score in scores {
        sum += score
    }
    
    if scores.count > 0 {
        return sum / scores.count
    } else {
        return 0
    }
}

averageOf([84, 86, 78, 98, 80, 92, 84])
averageOf([])
