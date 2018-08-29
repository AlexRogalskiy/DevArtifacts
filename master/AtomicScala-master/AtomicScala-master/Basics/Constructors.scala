class AllByDefault(chefValue: Boolean = false, pupaValue: Boolean = false)

val lbd = new AllByDefault

class AdvancedClass(holiday: Boolean = false, val name: String) {
  def makeSomeNoise() {
    println(holiday, name)
  }

  def makeSomeNoise1 = println(holiday, name)

  makeSomeNoise()
}

val adv = new AdvancedClass(name = "Xmas")

println(adv.name)

class AuxiliaryConstructors(val isAble: Boolean, val isCapable: Boolean, isStrongEnough: Boolean) {
  def this(isAble: Boolean) {
    this(isAble, false, false)
  }

  //  def this(isCapable:Boolean){
  //    this(isAble=false, isCapable = isCapable, isStrongEnough = false)
  //  }
}