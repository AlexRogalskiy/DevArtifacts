def cutoff(in: Int, thresh: Int, add: Int) =
  if (in < thresh)
    None
  else
    Some(in + add)

def a(in: Int) = cutoff(in, 7, 1)
def b(in: Int) = cutoff(in, 8, 2)
def c(in: Int) = cutoff(in, 9, 3)

def f(in: Int) =
  for {
    u <- Some(in)
    v <- a(u)
    w <- b(v)
    x <- c(w)
    y = x + 10
  } yield y * 2 + 1

println(f(7), f(6))

val result = for {
  i <- 1 to 10
  j <- f(i)
} yield j

println(result)