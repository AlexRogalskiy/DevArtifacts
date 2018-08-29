trait Aerobic {
  val age: Int

  def minAerobic = 0.5 * (220 - age)

  def isAerobic(heartRate: Int) = heartRate >= minAerobic
}

trait Activity {
  val action: String

  def go: String
}

class Person(val age: Int)

class Exerciser(age: Int, val action: String = "Running", val go: String = "Run!")
  extends Person(age) with Activity with Aerobic

val bob = new Exerciser(44)

println(s"${bob.isAerobic(180)} ${bob.isAerobic(80)} ${bob.minAerobic}")