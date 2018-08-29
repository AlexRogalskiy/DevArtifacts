object AplusB {
  def main(args: Array[String]) {
 val n = scala.io.StdIn.readInt
 
 var fubNum=new Array[Int](n+1)
 fubNum(0)=0
 fubNum(1)=1
 fubNum(2)=1
 if (n>=3) for (i<-3 to n) {
     fubNum.update(i, (fubNum(i-1) + fubNum(i-2)))
     }
     
     println(fubNum(n))
  }
}
