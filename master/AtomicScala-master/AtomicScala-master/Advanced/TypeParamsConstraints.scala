trait Resilience

object Bounciness extends Enumeration {

  case class _Val() extends Val with Resilience

  type Bounciness = _Val
  val level1, level2, level3 = _Val()
}

import Bounciness._

object Flexibility extends Enumeration {

  case class _Val() extends Val with Resilience

  type Flexibility = _Val
  val type1, type2, type3 = _Val()
}

import Flexibility._

trait Spring[R <: Resilience] {
  val res: R
}

case class BouncingBall(res: Bounciness) extends Spring[Bounciness]

println(BouncingBall(level2))

case class FlexingWall(res: Flexibility) extends Spring[Flexibility]

println(FlexingWall(type3))

//------------------------------------------------------------
class WithF {
  def f(n: Int) = n * 11
}

class CallF[T <: WithF](t: T) {
  def g(n: Int) = t.f(n)
}

println(new CallF(new WithF).g(2))

println(new CallF(new WithF {
  override def f(n: Int): Int = n * 7
}).g(2))