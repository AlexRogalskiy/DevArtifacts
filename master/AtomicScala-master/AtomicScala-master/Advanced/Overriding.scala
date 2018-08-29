class A{
  def say = "hello"
}

class B extends A {
  override def say = s"${super.say} World"
}
val inst = new B
println (inst.say)