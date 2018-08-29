object LinearSearch {
  def main(args: Array[String]) {
    val input = scala.io.StdIn.readLine().split(" ").map(x=>x.toInt)
    val key= scala.io.StdIn.readInt()

    print(linearSearchRec(input, 0, key))

  }

  def linearSearchRec(arr:Array[Int],start:Int, key:Int ):Int = {
    if (start>=arr.size)  	return -1
  	val elem=arr(start)
  	if (elem==key) {
  	 return start
  	 } else {
  	 	linearSearchRec(arr, start+1, key)
  	 }  	
  }
}