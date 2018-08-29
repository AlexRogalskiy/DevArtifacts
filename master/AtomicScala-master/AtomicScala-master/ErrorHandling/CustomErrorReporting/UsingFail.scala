import util.{Try, Success}
import com.atomicscala.reporter.Fail

def f(i: Int) =
  if (i < 0)
    Fail(s"Negative value: $i")
  else if (i > 10)
    Fail(s"Value too large: $i")
  else
    Success(i)

println(f(-1), f(7), f(11))

def calc(a: Int, b: String, c: Int) =
  for {
    x <- f(a)
    y <- Try(b.toInt)
    sum = x + y
    z <- f(c)
  } yield sum * z

println(calc(10, "11", 7),
  calc(15, "11", 7),
  calc(10, "11", -1))