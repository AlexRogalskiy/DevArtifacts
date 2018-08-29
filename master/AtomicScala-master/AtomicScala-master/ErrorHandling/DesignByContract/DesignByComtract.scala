import util.Try

class Contractual {
  def f(i: Int, d: Double) = {
    require(i > 5 && i < 100, "i must be within 5 and 100")
    val result = d * i
    assume(result < 1000, "result must be less than 1000")
    result
  }
}

def test(i: Int, d: Double) =
  Try(new Contractual().f(i, d)).recover {
    case e => e.toString
  }.get

println(test(10, 99), test(11, 99), test(0, 0))