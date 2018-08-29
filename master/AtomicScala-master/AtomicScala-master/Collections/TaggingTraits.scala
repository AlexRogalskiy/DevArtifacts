sealed trait Color

case object Red extends Color

case object Green extends Color

case object Blue extends Color

object Color {
  val values = Vector(Red, Green, Blue)
}

def display(c: Color) = c match {
  case Red => s"It's $c"
  case Green => s"It's $c"
  case Blue => s"It's $c"
}

println(Color.values.map(display))