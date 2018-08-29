class Problem(val msg: String) extends Exception

def f(i: Int) =
  if (i == 0)
    throw new Problem("divide by zero")
  else 24 / i

def test(n: Int) =
  try {
    f(n)
  } catch {
    case err: Problem => s"Failed:${err.msg}"
  }

println(test(4), test(5), test(6), test(0), test(24), test(25))