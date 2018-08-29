package ma.thele

import org.scalatest.{ShouldMatchers, FlatSpec}

/**
 * @author Evgeniy Muravev
 */
class OriginalSamplesTest extends FlatSpec with ShouldMatchers {
  "Original samples" should "be processed properly with the desired result" in {
    val orders00 = OrderParser.fromInputStream(this.getClass.getClassLoader.getResourceAsStream("00.txt"))

    MinAverageTimeCalculator(orders00) shouldEqual(9)

    val orders01 = OrderParser.fromInputStream(this.getClass.getClassLoader.getResourceAsStream("01.txt"))

    MinAverageTimeCalculator(orders01) shouldEqual(8)
  }
}
