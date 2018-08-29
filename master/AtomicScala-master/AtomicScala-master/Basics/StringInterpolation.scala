import java.util.Random

val rnd = new Random().nextInt(100)

println(s"instance #$rnd")
println(s"instance #${new Random().nextInt(100)}")

case class InterpolationTest(chefValue:Boolean)

println(s"${InterpolationTest(true)}")