object ScanSort {
  def main(args: Array[String]) {
    val input = scala.io.StdIn.readLine().split(" ").map(x=>x.toInt)
    print(scanSort(input).deep.mkString("\n"))
  }

  def scanSort(arr:Array[Int]): Array[Int] = {
    val scanner=Array.fill[Int](10)(0)
    for (i<-arr) {
      scanner(i)+=1
    }
    var pointer=0
    for (i<-scanner.indices) {            
      if (scanner(i)!=0)
        for (j<-0 to scanner(i)-1){ 
         arr(pointer)=i
         pointer+=1
       }
    }
    arr
  }
}
