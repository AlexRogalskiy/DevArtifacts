package ma.thele

import ma.thele.model.Order

/**
 * @author Evgeniy Muravev
 */
trait MinAverageTimeCalculator extends (Seq[Order] => Int)

/**
 * Minimal average time calculator uses
 * Shortest Job Next approach on scheduling,
 */
object MinAverageTimeCalculator extends MinAverageTimeCalculator {
  def apply(orders: Seq[Order]) = {
    countTotalTime(orders) / orders.size
  }

  private def reOrder(orders: Seq[Order], startTime: Int): Seq[Order] = orders match {
    case Nil => Nil

    case other =>
      // According to SJN principle we re-order the order so that
      // the task, that may be executed simultaneously,
      // will be sorted incrementally by timeToCook
      val (toSort, tail) = orders.span(_.receivedAt <= startTime)
      // the time at which all the sorted task wills be completed
      val sortedTime = toSort.map(_.timeToCook).fold(startTime)(_ + _)
      toSort.sortBy(_.timeToCook) ++ reOrder(tail, sortedTime)

  }

  private def countTotalTime(orders: Seq[Order]): Int = {
    var prevWaitTime = 0
    var prevReceivedAt = 0

    val waitTimes = reOrder(orders, 0) map { order =>
      val receivedDelta = prevReceivedAt - order.receivedAt
      val waitTime = prevWaitTime + receivedDelta + order.timeToCook
      prevWaitTime = waitTime
      prevReceivedAt = order.receivedAt
      waitTime
    }

    // summing up
    waitTimes.fold(0)(_ + _)
  }
}
