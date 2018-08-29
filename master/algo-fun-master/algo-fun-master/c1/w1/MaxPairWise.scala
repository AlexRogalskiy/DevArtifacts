object MaxPairWise {
  def main(args: Array[String]) {
    val inputNumber = scala.io.StdIn.readInt
    val input = scala.io.StdIn.readLine().split(" ").map(x=>x.toLong)
    if (input.size < 2) {
        println("Abnormal size, exitting")
        System.exit(0)
    }
    var maxI:Int=0
    var maxI2:Int=0


    for (i<- input.indices) {
        if (input(i)>input(maxI)) maxI=i 
    }

    if (maxI==0) maxI2=1 else maxI2=0

    for (i<- input.indices) {
    	if (i!=maxI && input(i)>input(maxI2)) maxI2=i
    }
    
    println(s"${input(maxI)*input(maxI2)}")
  }

}
