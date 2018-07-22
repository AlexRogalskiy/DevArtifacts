package org.gs.search

import org.gs.fixtures.WordArrayBuilder
import org.scalatest.FlatSpec

/** ScalaTest for Ternary Search Trie
  * @see [[https://algs4.cs.princeton.edu/52trie/TST.java.html]]
  *
  * @author Gary Struthers
  */
class TSTSuite extends FlatSpec {
  behavior of "a TST"

  it should "sort fixed length strings and return their stored values" in new WordArrayBuilder {
    val managedResource = readURI("https://algs4.cs.princeton.edu/52trie/shellsST.txt")
    val strings = managedResource.loan(readFileToArray).toArray
    val tst = new TST[Int]()
    strings.zipWithIndex.foreach(x => tst.put(x._1, x._2))
    assert(tst.keys.diff(Array[String]("by", "sea", "sells", "she", "shells", "shore", "the")) === List())

    val values = for (key <- tst.keys) yield tst.get(key) match {
      case None =>
      case Some(x) => x
    }
    assert(values.diff(Array[Int](4,6,1,0,3,7,5)) === List())
  }
}
