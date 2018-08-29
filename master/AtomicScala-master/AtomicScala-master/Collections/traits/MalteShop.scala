//!Contains an unfixed bug!
import sodafountain._
import Quantity._
import Holder._
import Syrup._
import IceCream._
import Sprinkle._

case class Scoops(holder: Holder, scoops: Scoop*)

val IceCreamCone = Scoops(WaffleCone, Scoop(Extra, MochaFudge),
  Scoop(Extra, ButterPecan), Scoop(Extra, IceCream.Chocolate))

println(IceCreamCone)

case class MadeToOrder(holder: Holder, scoops: Seq[Scoop], toppings: Seq[Topping])

val iceCreamDish = MadeToOrder(Bowl, Seq(Scoop(Regular, Strawberry),
  Scoop(Regular, ButterPecan)), Seq[Topping]())

println(iceCreamDish)

case class Sundae(sauce: Sauce, sprinkles: Sprinkles, whipped: WhippedCream, nuts: Nuts, scoops: Scoop*) {
  val holder: Holder = Bowl
}

val hotFudgeSundae = Sundae(Sauce(Regular, HotFudge),
  Sprinkles(Regular, Sprinkle.Chocolate),
  WhippedCream(Regular),
  Nuts(Regular),
  Scoop(Regular, Coffee),
  Scoop(Regular, RumRaisin))


println(hotFudgeSundae)
