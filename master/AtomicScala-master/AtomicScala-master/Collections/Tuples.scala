def returnTuple(vale: Boolean): (String, String) = {
  if (vale)
    ("it's hot", "in here")
  else
    ("it's kinda", "cold")
}

println(returnTuple(true))
println(returnTuple(false))

def f = (true, false, 3.14, "chef", "pupa")

val (a,b,c,d,e) = f

println(a)
println(b)
println(c)
println(d)
println(e)

println((d,e))

val all = f
println(all._1)
println(all._2)
println(all._3)
println(all._4)
println(all._5)

case class Employee(name:String, ID:Int)
val empA = Employee("Bob", 1130)
val Employee(nm, id) = empA

println(nm)
println(id)

var (x,y,z) = ("chef","pupa","diop")
println(x)
println(y)
println(z)