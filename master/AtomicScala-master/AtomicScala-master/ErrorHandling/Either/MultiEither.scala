//Only a concept, doesn't work

def tossEither(which: Int) = which match {
  case 1 => Left(Except1("Reason"))
  case 2 => Left(Except2(11))
  case 3 => Left(Except3("Wanted", 1.618))
  case _ => Right("OK")
}

def test(n: Int) = tossEither(n) match {
  case Left(err) => err match {
    case Except1(why) => s"$why"
    case Except2(n) => s"$n"
    case Except2(msg, d) => s"$msg $d"
  }
  case Right(x) => x
}

test(0)
test(1)
test(2)
test(3)