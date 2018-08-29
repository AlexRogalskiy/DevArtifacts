class Chef(value: Boolean) {
  println(s"i'm chef and this is $value")

  def this() = this(false)
}

class Pupa(value: Boolean) extends Chef(value) {
  println(s"i'm pupa and this is $value")
}

class Buba(value: Boolean) extends Chef {
  println(s"i'm buba and this is $value")
}

new Pupa(true)

new Buba(false)

case class A()
//not possible!
//case class B() extends A()