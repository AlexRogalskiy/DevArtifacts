def p(s: Option[String]) = s.foreach(println)

p(Some("Hi"))
p(Option("Hi"))
p(None)

def f(s: Option[String]) = s.map(_ * 2)

println(
  f(Some("Hi")),
  f(None),
  Option(null))

