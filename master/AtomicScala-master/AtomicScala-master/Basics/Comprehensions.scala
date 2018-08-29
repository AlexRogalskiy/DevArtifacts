def evenGT5(v: Vector[Int]) = {
  var result = Vector[Int]()
  for {n <- v
       if n > 5
       if n % 2 == 0} {
    result = result :+ n
  }
  result
}

val v = Vector(1, 2, 3, 4, 5, 6, 7, 8, 9)

println(evenGT5(v))

def oddGT5Refactored(v: Vector[Int]) = {
  val result =
    for {n <- v
         if n > 5
         if n % 2 != 0}
    yield n

  result
}


def oddGT5Refactored2(v: Vector[Int]) = {
  for {n <- v
       if n > 5
       isOdd = (n % 2 != 0)
       if (isOdd)}
  yield n
}

println(oddGT5Refactored2(v))

def oddGT5Refactored3(v: Vector[Int]) = {
  for {n <- v
       if n > 5
       isOdd = (n % 2 != 0)
       if (isOdd)}
  yield {
    val u = n * 10
    u + 2
  }
}
println(oddGT5Refactored3(v))

def yielding4(v: Vector[Int]) = {
  for {n <- v
       if n > 5
       isOdd = (n % 2 != 0)
       if (isOdd)}
  yield {
    for (u <- Range(0, n))
    yield u
  }
}
println(yielding4(v))