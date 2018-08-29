object MultPoly {
  def main(args: Array[String]) {
    val input1 = scala.io.StdIn.readLine().split(" ").map(x=>x.toInt)
    val input2 = scala.io.StdIn.readLine().split(" ").map(x=>x.toInt)
    val n= scala.io.StdIn.readInt()

    // print(bSearchRec(input, 0, input.size, key))
    MultPoly(input1, input2, n).foreach(x=>print(s"$x + "))

  }

  def MultPoly(arr1:Array[Int], arr2:Array[Int], n:Int):Array[Int] = {
    val product=Array.fill[Int](2*n-1)(0)

    for (i<-0 to n-1) {
      for (j<-0 to n-1) {
        product(i+j)= product(i+j) + arr1(i) * arr2(j)
      }
    }
    return product
  }
}
