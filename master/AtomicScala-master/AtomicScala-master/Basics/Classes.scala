import java.util.{Random => Rnd}

class Mammal {
  def meow(cnt:Int) = {
    "i'm a cat " + cnt
  }
  println("instantiating")
  val immut = "123"

  var mut = 123
}

val inst = new Mammal

println(inst.immut)
println(inst.meow(1))

val rnd = new Rnd()

println(rnd.nextInt(100))

class Royalty(clazz:String, chefValue:Boolean){
  var partOfRoyalFamily:Boolean = _
  val id = rnd.nextInt(100)
  println("new royalty has been added",clazz, chefValue, partOfRoyalFamily, id)
  def makeMeSir={println(clazz+" has been promoted to Sir")}

}

val chef = new Royalty("chef", true)
chef.partOfRoyalFamily = true
new Royalty("pupa", false)
chef.makeMeSir
//class Animal(cnt:Int, name:String){
//  var cnt
//}

class RndClass1(val arg:Int)
class RndClass2(var arg:Int)

val rnd1 = new RndClass1(3)
val rnd2 = new RndClass2(6)
println(rnd1.arg)
rnd2.arg = 10
println(rnd2.arg)

class VarArg(arg:Int*){
  for (i<-arg) println(i)
}

println(new VarArg(1,2,3,4,5,6,7))
//named args
class Named(chefValue:Boolean, pupaValue:Boolean, amount: Double){
  println(chefValue, pupaValue, amount)
}

println(new Named(pupaValue = false, chefValue = true, amount = 13.2))

//default atgs

class DefaultArgs(superValue:Boolean, loserValue:Boolean=false, amount: Double=20.02){
  println(superValue, loserValue, amount)
}

println(new DefaultArgs(superValue = true))

class NamedVarArg(mom:Boolean, dad:Boolean,kids:String*)

val chef1 = new NamedVarArg(mom = true, dad= false, kids = "323","323")