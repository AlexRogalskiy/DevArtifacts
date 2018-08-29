sealed trait Result

case class Good(x: Int, y: String) extends Result

case class Bad(errMsg: String) extends Result

def tossCustom(which: Int) = which match {
  case 1 => Bad("No Good: 1")
  case 2 => Bad("No Good: 2")
  case 3 => Bad("No Good: 3")
  case _ => Good(which, "OK")
}

def test(n: Int) = tossCustom(n) match {
  case Bad(errMsg) => errMsg
  case Good(x, y) => (x, y)
}

println(test(47), test(1), test(2), test(3))