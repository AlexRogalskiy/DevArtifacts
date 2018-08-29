val left = Vector("a", "b", "c", "d")
val right = Vector("q", "r", "s", "t")

println(left.zip(right))

println(left.zip(0 to 4))

println(left.zipWithIndex)

def number(s: String) = Range(0, s.length).zip(s)

println(number("Howdy"))

case class Person(name: String, ID: Int)

val names = Vector("Bob", "Jill", "Jim")

val IDs = Vector(1731, 9274, 8378)

names.zip(IDs).map { case (n, id) => Person(n, id)}