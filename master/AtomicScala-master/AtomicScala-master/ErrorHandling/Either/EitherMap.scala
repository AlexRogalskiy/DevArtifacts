val evens = Range(0, 10) map {
  case x if x % 2 == 0 => Right(x)
  case x => Left(x)
}

println(evens)

println(evens map{
  case Right(x) =>s"Even $x"
  case Left(x) =>s"Odd $x"
})