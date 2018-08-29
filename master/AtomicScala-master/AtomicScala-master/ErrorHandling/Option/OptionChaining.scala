def f(n: Int, div: Int) =
  if (n < div || div == 0)
    None
  else
    Some(n / div)

println(
  f(0, 0),
  f(0, 0).foreach(println),
  f(11, 5),
  f(11, 5).foreach(println)
)

def g(n: Int, div: Int) = f(n, div).map(_ + 2)

println(g(5, 11), g(11, 5))