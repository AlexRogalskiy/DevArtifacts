import util.Success
import com.atomicscala.reporter.Fail

def test(i: Int) = f(i).recover {
  case e => s"Failed: $e"
}.get

def f(n: Int) =
  if (n == 0)
    Fail("Divide by zero")
  else
    Success(24 / n)
println(test(4), test(5), test(6), test(0), test(24), test(25))