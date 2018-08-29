package ma.thele

import java.io.FileInputStream

import scala.util.{Success, Try}
import scala.util.control.Exception.allCatch

/**
 * @author Evgeniy Muravev
 */
object Main {
  def main(args: Array[String]) {
    val inputStream = allCatch opt args(0) match {
      case Some(inputFileName) =>
        new FileInputStream(inputFileName)

      case None =>
        println("No correct input file passed, running the default sample")
        this.getClass.getClassLoader.getResourceAsStream("00.txt")
    }
    val orders = OrderParser.fromInputStream(inputStream)

    println(s"${MinAverageTimeCalculator(orders)}")
  }
}
