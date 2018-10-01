//: Playground - noun: a place where people can play

// Coding iPhone Apps for Kids
// Chapter 8 Examples

// Class Inheritance

// Creating a Superclass

class FarmAnimal {
    
    var name = "farm animal"
    var numberOfLegs = 4
    func sayHello() -> String {
        return "Hello I'm a farm animal!"
    }
    func description() {
        print("I'm a \(name) and I have \(numberOfLegs) legs.")
    }
}

// Creating a Subclass

class Sheep: FarmAnimal {
    
    override init() {
        super.init()
        name = "sheep"
    }
    
    override func sayHello() -> String {
        return "Baa Baa"
    }
    
    override func description() {
        super.description()
        print("I provide wool to make blankets.")
    }
}

let aSheep = Sheep()
aSheep.sayHello()
aSheep.description()

class Pig: FarmAnimal {
    
    override init() {
        super.init()
        name = "pig"
        numberOfLegs = 4
    }
    
    override func sayHello() -> String {
        return "Oink"
    }
    
    override func description() {
        super.description()
        print("I roll around in the mud.")
    }
}

// Detecting the Data Type by Typecasting

class Chicken: FarmAnimal {
    
    var numberOfEggs = 0
    
    override init() {
        super.init()
        name = "chicken"
        numberOfLegs = 2
    }
    
    override func sayHello() -> String {
        return "Bok Bok"
    }
    
    override func description() {
        super.description()
        print("I lay eggs.")
        if numberOfEggs == 1 {
            print("I have one egg for you now.")
        } else if numberOfEggs > 0 {
            print("I have \(numberOfEggs) eggs for you now.")
        }
    }
    
    func layAnEgg() {
        numberOfEggs += 1
    }
    
    func giveUpEggs() -> Int {
        let eggs = numberOfEggs
        numberOfEggs = 0
        return eggs
    }
}

let chicken1 = Chicken()
chicken1.layAnEgg()
let chicken2 = Chicken()
chicken2.layAnEgg()
chicken2.layAnEgg()

let animals = [Sheep(), chicken1, chicken2, Sheep(), Chicken(), Sheep(), Pig()]

for animal in animals {

    if animal is Sheep {
        print("This is what my sheep says: \(animal.sayHello())")
    } else if animal is Chicken {
    
        print("My chickens say: \(animal.sayHello())")
        
        //animal.layAnEgg() // error FarmAnimal has no member layAnEgg
        
        let chicken = animal as! Chicken
        chicken.layAnEgg()
        chicken.description()
        
    } else if animal is Pig {
        print("And here is my pig: \(animal.sayHello())")
    }
}

// Refining the Data Type by Downcasting

var gatheredEggs = 0
for animal in animals {
    
    if let chicken = animal as? Chicken {
        
        chicken.layAnEgg()
        print("Picking up \(chicken.numberOfEggs) eggs.")
        gatheredEggs += chicken.giveUpEggs()
    }
}
print("I gathered \(gatheredEggs) eggs today!")



