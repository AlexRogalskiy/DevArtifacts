case class MyCaseClass(chefValue:Boolean)

val ex = MyCaseClass(true)

println(ex.chefValue)

case class MyCaseClass1(var chefValue:Boolean)

val ex1 = MyCaseClass1(true)

ex1.chefValue=false
println(ex1)

case class StrangwBehaviour(name:String, age:Int=0, isMale:Boolean=true)

val newSpecies = StrangwBehaviour("chef", age=30)

println(newSpecies)

val vec1 = Vector(newSpecies, StrangwBehaviour("pupa"), StrangwBehaviour("diop"))

println(vec1)