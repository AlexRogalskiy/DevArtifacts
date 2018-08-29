val constants = Map("Pi" -> 3.141, "e" -> 2.718, "phi" -> 1.618)

println(constants)

println(Vector(("Pi", 3.141), ("e", 2.718), ("phi", 1.618)).toMap == constants)

println(constants("Pi"))

println(constants.values)
println(constants.keys)

println((for (pair <- constants) yield pair.toString))

println((for ((k, v) <- constants) yield s"$k : $v"))

println(constants.keys.toVector)

println((constants + ("pupa" -> "chef")))

import collection.mutable.Map

val m = Map(5 -> "five", 6 -> "six")
println(m)

m += 4 -> "four"

println(m)
