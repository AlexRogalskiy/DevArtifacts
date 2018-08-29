object MaximumSalary {
  def main(args: Array[String]) {
    var n = scala.io.StdIn.readInt
    val input = scala.io.StdIn.readLine().split(" ").map(x=>x.toInt)
    var acc=""
    while (input.filterNot(_ == -1).nonEmpty) {
        var maxDigit=Int.MinValue
    	for (digit <- input) {
            if (isGreaterOrEqual(digit,maxDigit))
            maxDigit=digit
        }
        acc+=maxDigit
        input(input.indexOf(maxDigit)) = -1
    }

    println(acc)
  }

  def isGreaterOrEqual(a:Int, b:Int):Boolean = {
    val a1 = a.toString() + b.toString()
    val b1 = b.toString() + a.toString()
    if (a1.compare(b1)>=0) true
      else
        false
  }
}
