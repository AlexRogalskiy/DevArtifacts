object ScanSort {
  val sep = " "

  def main(args: Array[String]) {
    val input = scala.io.StdIn.readLine().split(" ").map(x=>x.toInt)
    print(s"final ${printArr(mergeSort(input))}")
  }

  def mergeSort(arr:Array[Int]): Array[Int] = {
    if (arr.size==1)   return arr

    val m = arr.size/2
    
    val halfs = arr.splitAt(m) 
    val b = mergeSort(halfs._1)
    val c = mergeSort(halfs._2)
    merge(b,c)
}

def printArr(a:Array[Int]):String = a.deep.mkString(sep)

def merge(arr1:Array[Int], arr2:Array[Int]): Array[Int] = {
  // var d = Array.fill[Int](arr1.size+arr2.size)(0)
  var d = Array[Int]()
 
  while (arr1.filter(_ != -1).nonEmpty && arr2.filter(_ != -1).nonEmpty) {
    val b = arr1.filter(_ != -1).head
    val c = arr2.filter(_ != -1).head

    if (b<=c) {
      d = d:+b
      arr1(arr1.indexOf(b)) = -1
    } else {
      d = d:+c
      arr2(arr2.indexOf(c)) = -1
    }
  }
  
  d ++ arr1.filter(_ != -1) ++ arr2.filter(_ != -1) 
}
}
