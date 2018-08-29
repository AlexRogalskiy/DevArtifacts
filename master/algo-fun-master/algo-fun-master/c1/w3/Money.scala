object Money {
  def main(args: Array[String]) {
    var input = scala.io.StdIn.readInt
    var acc=0
    while (input!=0) {
    	if (input-10>=0) {
    		acc+=1
    		input-=10
    	} else if (input-5>=0) {
    		acc+=1
    		input-=5
    		} else if (input-1>=0){
    			acc+=1
    		    input-=1
    		}
    }

    println(acc)
  }
}
