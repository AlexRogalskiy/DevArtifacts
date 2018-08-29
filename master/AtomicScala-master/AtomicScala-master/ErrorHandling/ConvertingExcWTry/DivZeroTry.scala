import util.{Try, Success, Failure}
def f(i:Int) = Try(24/i)

println(f(24),f(0))

def test(n:Int) =
f(n) match {
  case Success(r) => r
  case Failure(e) => s"Failed ${e.getMessage}"
}

println(test(24),test(0))
