testSeq(Vector(11, 7, 22, 11, 11))

testSeq(List(11, 7, 22, 11, 11))

def testSeq(s: Seq[Int]) = {
  println(s"${s.getClass.toString.replace('.', ' ').split(' ').last} is empty? ${s.isEmpty}")
  println(s"${s.length}")
  //appending to the end
  println(s :+ 99)
  //inserting in the beginning
  println(99 +: s)
  println(s.head)
  println(s.tail)
  println(s.last)
  println(s.drop(3))
  println(s.dropRight(3))
  println(s.take(3))
  println(s.takeRight(3))
  println(s.slice(2, 5))
  val third = s(3)
  println(third)
  println(s.contains(22))
  println(s.indexOf(22))
//  replace element at location 3
  println(s.updated(3,16))
  //remove location 3
  println(s.patch(3, Nil, 1))
  println (s++Seq(99,98))
  //find unique values and sort them
    println(s.distinct.sorted)
    println(s.reverse)

    println(s.intersect(Seq(99.98)))
    println(s.min)
    println(s.max)
    println(s.startsWith(Seq(1,7)))
    println(s.endsWith(Seq(11,17)))
    println(s.sum)
//  multiply together (like reduce)
    println(s.product)
    println(s.toSet)
}