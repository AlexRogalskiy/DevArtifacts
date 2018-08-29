val evens = Range(0, 10).map(Option(_).filter(_ % 2 == 0)).foreach(println)

evens map {
  case Some(x) => s"Even $x"
  case None => "Odd"
}

