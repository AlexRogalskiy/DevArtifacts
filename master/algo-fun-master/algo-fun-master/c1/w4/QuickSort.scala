object QuickSort {
  val sep = " "

  def main(args: Array[String]) {
    val input = scala.io.StdIn.readLine().split(" ").map(x=>x.toInt)
    print(s"final ${printArr(quickSort(input, 0, input.size-1))}")
  }

  def quickSort(arr:Array[Int], l: Int, r: Int): Array[Int] = {
    if (l>=r)   return arr

    val m = partitition(arr, l, r)

    quickSort(arr, l, m - 1)
    quickSort(arr, m + 1, r)
}

def printArr(a:Array[Int]):String = a.deep.mkString(sep)

def partitition(arr1:Array[Int], l:Int, r: Int): Int = {
  // var d = Array.fill[Int](arr1.size+arr2.size)(0)
  def swap(el1:Int, el2:Int) = {
    val buf = arr1(el1)
    arr1(el1) = arr1(el2)
    arr1(el2) = buf
  }
  val x = arr1(l)
  
  var j=l
 
  for (i <- l + 1 to r ) {
    if ( arr1(i) <= x) {
      j+=1
      swap(j, i)
    }
  }

 swap(l, j)
 return j
}
}
