package ma.thele

import java.io.InputStream

import ma.thele.model.Order

import scala.io.Source

/**
 * @author Evgeniy Muravev
 */
trait OrderParser {
  def fromInputStream(inputStream: InputStream): Seq[Order]
}

object OrderParser extends OrderParser {
  val LineRegex = """(\d+)\s(\d+)""".r

  def fromInputStream(inputStream: InputStream): Seq[Order] = {
    Source.fromInputStream(inputStream).getLines().drop(1).toSeq.map {
      case LineRegex(receivedAt, timeToCook) =>
        Some(Order(receivedAt.toInt, timeToCook.toInt))
      case other =>
        None
    } flatten
  }
}
