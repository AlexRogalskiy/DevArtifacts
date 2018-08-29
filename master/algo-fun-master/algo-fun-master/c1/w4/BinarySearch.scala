object BinarySearch {
  def main(args: Array[String]) {
    val input = scala.io.StdIn.readLine().split(" ").map(x=>x.toInt)
    val key= scala.io.StdIn.readInt()

    // print(bSearchRec(input, 0, input.size, key))
    print(bSearchIt(input, 0, input.size, key))

  }

  def bSearchRec(arr:Array[Int], start:Int, finish:Int, key:Int):Int = {
    if (finish<start)  	return start-1
    val mid = start+(finish-start)/2
  	val elem=arr(mid)
  	if (elem==key) {
  	 return mid
  	 } else if (key<elem) {
  	 	bSearchRec(arr, start, mid-1, key)
  	 } else bSearchRec(arr, mid+1, finish, key)
  }

  def bSearchIt(arr:Array[Int], start:Int, finish:Int, key:Int):Int = {
    var finishMut =finish
    var startMut =start
    while (startMut<=finishMut) {
      var mid = startMut+(finishMut-startMut)/2
      var elem=arr(mid)

     if (elem==key) {
      return mid
     } else if (key<elem) {
      finishMut=mid-1
     } else startMut=mid+1 
    }
    return startMut - 1
  }
}
