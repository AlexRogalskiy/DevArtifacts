case class Person(name: String)

def acceptAnything(x: Any) = {
  x match {
    case s: String => "A string" + s
    case i: Int if (i < 20) => s"Int is less than 20 $i"
    case i: Int => s"Some other int $i"
    case p: Person => s"The person ${p.name}"
    case _ => "No one knows what it is"
  }
}

println(acceptAnything("chef"))
println(acceptAnything(10))
println(acceptAnything(30))
println(acceptAnything(Person("Chef")))
println(acceptAnything(Unit))

case class Passenger(first: String, last: String)

case class Train(passengers: Vector[Passenger], line: String)

case class Bus(passengers: Vector[Passenger], capacity: Int)

def travel(transport: Any) = {
  transport match {
    case Train(passengers, line) => s"Train line $passengers $line"
    case Bus(passengers, seats) => s"Bus size $seats $passengers"
    case Passenger => "Walking along"
//    case what => s"Unknown matter $what"
    case _ => "Unknown matter"
  }
}

val travelers = Vector(
  Passenger("super", "chef"),
  Passenger("simple", "pupa"))

val trip = Vector(Train(travelers, "Reading"), Bus(travelers, 100))

println (travel(trip(0)))
println (travel(trip(1)))
println (travel(Unit))
