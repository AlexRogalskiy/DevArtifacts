package codelisting

import java.io.FileNotFoundException

class ExtenstionException(name: String) extends Exception(s"$name doesn't end with '.scala'")

class CodeListing(val filename: String) extends collection.IndexedSeq[String] {
  if (!filename.endsWith(".scala"))
    throw new ExtenstionException(filename)
  val vec = io.Source.fromFile(filename).getLines.toVector

  def apply(idx: Int) = vec(idx)

  def length = vec.length
}

object CodeListing {
  def apply(name: String) = {
    try {
      new CodeListing(name)
    } catch {
      case _:FileNotFoundException => Vector(s"File not found $name")
      case _:NullPointerException => Vector("Error:Null file name")
      case e:ExtenstionException => Vector(e.getMessage)
    }
  }

}
