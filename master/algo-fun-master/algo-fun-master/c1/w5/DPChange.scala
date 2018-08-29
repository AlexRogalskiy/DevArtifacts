object DPChange {
  val sep = " "

  def main(args: Array[String]) {
    val money = scala.io.StdIn.readInt()
    val coins = scala.io.StdIn.readLine().split(" ").map(x=>x.toInt)
    val minNumCoins=Array(0)

    for (m<- 1 to money) {
      minNumCoins(m) = -1
      for (i <- coins) {
        if (m >= i) {
          val numCoins = minNumCoins(m-i) +1 
          if (numCoins < minNumCoins(m)) {
            minNumCoins(m) = numCoins
          }
        }
      }
    }

    print(minNumCoins(money))
  } 
}
