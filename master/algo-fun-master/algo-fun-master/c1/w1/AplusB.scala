object AplusB {
  def main(args: Array[String]) {
    val input = scala.io.StdIn.readLine().split(" ")
    if (input.size == 1 || input.size>3) {
    	println("Abnormal size, exitting")
    	System.exit(0)
    }
    println(input.map(x=>x.toInt).reduceLeft(_ + _))
  }
}
