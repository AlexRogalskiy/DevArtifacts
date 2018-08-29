trait Color {
  def f: Int

  val d: Double
}

trait Texture {
  def setCourse(in: Int) = "the course is set!"
}

trait Hardness

abstract class Pupa extends Color

class Chef extends Pupa with Texture with Hardness {
  override def f: Int = 123

  override val d: Double = 2.3
}

trait Construction {
  println("instance created")
}

class Inst extends Construction

trait Abst extends Pupa

trait Absrt extends Chef

trait Abstru extends Absrt

new Inst

val x = new Construction with Texture

trait A{
  def f = 1.1
  def g = "A.g"
  val n =7
}

trait B{
  def f = 7.7
  def g = "B.g"
  val n = 17
}

object C extends A with B{
  override def f: Double = 9.9

  override def g: String = super[A].g + super[B].g

  override val n: Int = 27
}

println(s"${C.f} ${C.g} ${C.n}")

trait Framework{
  val part1:Int
  val part2:Double
  def templateMethod = part1+part2
}

def operation(impl:Framework) = impl.templateMethod

class Implementation extends Framework{
  override val part1: Int = 42
  override val part2: Double = 2.71828
}

println(operation(new Implementation))