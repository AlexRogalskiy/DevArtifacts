abstract class Pupa{
  def name:String
  val pronounce = s"My name is $name"
  def act:String
}

class Chef extends Pupa{
  def name = "Chef"
  override def act = s"Finaly, $name is doing something useful!"
}


println((new Chef).act)
println((new Chef).pronounce)

abstract class X(value:Boolean)

class Y(value:Boolean) extends X(value)

case class Z(value:Boolean) extends X(value)