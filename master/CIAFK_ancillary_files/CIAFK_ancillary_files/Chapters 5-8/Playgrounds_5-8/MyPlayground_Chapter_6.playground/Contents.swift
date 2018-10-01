//: Playground - noun: a place where people can play

// Coding iPhone Apps for Kids
// Chapter 6 Examples

// Keeping Things in Order with Arrays

var nationalParks: [String] = ["Acadia", "Zion", "Grand Canyon"]

print("The first park I went to was \(nationalParks[0]).")
print("The second park was \(nationalParks[1]).")

// This will not work
//print("And the third park is \(nationalParks[3]).") // Error

nationalParks.append("Badlands")
nationalParks.insert("Petrified Forest", at: 3)

let fruits = ["banana", "kiwi", "blueberries"]
let liquids = ["honey", "yogurt"]
var smoothie = fruits + liquids
smoothie += ["whipped cream"]

var shoppingList = ["milk", "bread", "candy", "apples", "ham"]
let purchasedItem = shoppingList.removeLast()
// Check what is left in the shopping list
shoppingList
let notGoingToPurchase = shoppingList.remove(at: 2)
shoppingList
shoppingList.removeAll()
//shoppingList.remove(at: 3) // Error

var favoriteAnimals = ["Lion", "Alligator", "Elephant"]
favoriteAnimals[2] = "Unicorn"
favoriteAnimals[0] = "Bearded dragon"
favoriteAnimals

// This will cause an error
//favoriteAnimals[3] = "Standard Poodle" // Error

let mySiblings = ["Jackie", "Gretchen", "Jude"]
if mySiblings.isEmpty {
    print("I don't have any siblings.")
} else {
    print("I have \(mySiblings.count) siblings.")
}

let pizzaToppings = ["Cheese", "Tomato", "Pepperoni", "Sausage", "Mushroom", "Onion", "Ham", "Pineapple"]
for topping in pizzaToppings {
    print(topping)
}

let myNumbers = [1, 4, 7, 10, 12, 15]
print("This is myNumbers array: \(myNumbers)")
print("Here are the squares of all of myNumbers:\n")
for number in myNumbers {
    print("\(number) squared is \(number * number)")
}

// Dictionaries are Key!

var usStates = ["MA": "Massachusetts", "TX": "Texas", "WA": "Washington"]

let fractions = [0.25: "1/4", 0.5: "1/2", 0.75: "3/4"]

if let loneStarState = usStates["TX"] {
    print("I have \(loneStarState) in my dictionary.")
} else {
    print("I don't have that state in my dictionary.")
}

if let sunshineState = usStates["FL"] {
    print("I have \(sunshineState) in my dictionary.")
} else {
    print("I don't have that state in my dictionary.")
}

usStates["MN"] = "Minnesota"
usStates

usStates["MA"] = nil
usStates

var colorFruits = ["red": "apple", "yellow": "banana"]
colorFruits["red"] = "raspberry"
colorFruits

let fruitBasket = ["Apple": "$0.50", "Banana": "$1.00", "Orange": "$0.75"]
if fruitBasket.isEmpty {
    print("I do not have any fruit.")
} else {
    print("I have \(fruitBasket.count) pieces of fruit for sale.")
}

for fruit in fruitBasket.keys {
    print("One \(fruit) costs \(fruitBasket[fruit]!)")
}

for price in fruitBasket.values {
    print("I have a piece of fruit that costs \(price)")
}


