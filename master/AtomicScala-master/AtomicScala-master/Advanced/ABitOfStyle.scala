//UNIFORM ACCESS PRINCIPLE
case class Style(va: Boolean) {
  //when a method without the args mutates the state it's convenient to write it with parenthesis
  def getA() = va

  //if it doesn't mutate, it's common to write the method without parenthesis
  def getB = va
}

val st = Style(true)

//st.getA()
//it's better to write like this
st.getB

case class Stub() {
  def +(x: Any) = {
    s"adding $x"
  }

  def -(x: Any) = {
    s"subtracting $x"
  }
}

val ins = Stub()

println(ins - 1)
println(ins + 1)


class Chef{
  override def toString = "chef's output"
}

println (new Chef)