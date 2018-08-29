def rPrint(s:Seq[Char]):Unit = {
  println(s.seq)
  if (s.tail.nonEmpty){
    rPrint(s.tail)
  }
}

rPrint("Recursion")

def sumIt(toSum:List[Int], sum:Int=0):Int = {
  if (toSum.isEmpty)
    sum
  else
    sumIt(toSum.tail, sum+toSum.head)
}

println(sumIt(List(10,20,30,40,50)))
println(List(10,20).sum)
println((10 to 50 by 10).sum)