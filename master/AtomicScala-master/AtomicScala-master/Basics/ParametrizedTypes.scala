val v1 = Vector(1, 2, 3)
val v2 = Vector("one", "two", "three")

println(v1)
println(v2)

val v3:Vector[Int] = Vector(1,2,3)
val v4:Vector[String] = Vector("one","two","three")

println(v3)
println(v4)
println(v4 == v2)
println(v1 == v3)

def returnVector():Vector[Int] = {Vector(1,2,3)}
