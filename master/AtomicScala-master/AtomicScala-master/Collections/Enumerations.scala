object Level extends Enumeration {
  type Level = Value
  val Overflow, High, Medium, Low, Empty = Value
}

import Level._
println(Medium)

println({
  for (level <- Level.values) yield level
}.toIndexedSeq)

println({
  for (lev <- Range(0, Level.maxId)) yield (lev, Level(lev))
})

def checkLevel(level: Level) = level match {
  case Overflow => "Bang!"
  case Empty => "nothing"
  case other => s"level $level is OK"
}

println(checkLevel(Low))