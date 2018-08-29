case class X() {
  println("obj created")
  def increment() = {
    X.n += 1
    X.n
  }
}

object X {
  println("companion created")
  var n = 0
}
val ins = X()
ins.increment()
ins.increment()
X.n+=1

println(ins.increment())

class Y {
  println("obj2 created")

}

object Y {
  println("companion2 created")
  var n = 0
  def increment() = {
    n += 1
    n
  }
}

println(Y.increment())

class Count{
  val id = Count.id()
  override def toString = s"Count$id"
}

object Count{
  var n = -1
  def id()= {n+=1;n}
}

val vec = Vector(new Count,new Count,new Count,new Count,new Count,new Count)
println(vec)

case class Count1(){
  val id = Count1.id()
//  override def toString = s"Count$id"
}

object Count1{
  var n = -1
  def id()= {n+=1;n}
}

val vec1 = Vector(Count1,Count1)
println(vec1)

class Car(make:String){
  override def toString = s"Car$make"
}

object Car{
  def apply(make:String) = new Car(make)
}

val myCar = Car("Toyota")

println(myCar)