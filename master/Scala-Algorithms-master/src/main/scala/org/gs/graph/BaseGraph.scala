package org.gs.graph

/** Common code for graph and digraph
  *
  * @constructor called by subclass with a vertex count
  * @param numV number of vertices
  * @see [[https://algs4.cs.princeton.edu/41undirected/Graph.java.html]]
  * @see [[https://algs4.cs.princeton.edu/42directed/Digraph.java.html]]
  * @author Scala translation by Gary Struthers from Java by Robert Sedgewick and Kevin Wayne.
  */
abstract class BaseGraph(val numV: Int) {
  private var _e = 0
  protected[gs] val adj = Array.fill[List[Int]](numV)(List[Int]())

  def e(): Int = _e

  /** add edge between vertices v and w */
  def addEdge(v: Int, w: Int): Unit = {

    def rangeGuard(x: Int): Boolean = x match {
        case x if 0 until numV contains x => true
        case _ => false
    }

    require(rangeGuard(v) && rangeGuard(w), s"aV:$v and otherV:$w must be in 0-$numV")
    _e += 1
    adj(v) = w :: adj(v)
  }

  override def toString(): String = {
    val lf = sys.props("line.separator")
    val sb = new StringBuilder()
    sb append (s"$numV ${_e} $lf")

    def addLines(v: Int) {
      sb append (s"$v : ")
      adj(v) foreach(e => sb append (s"$e  "))
      sb append (lf)
    }

    for(v <- 0 until numV) addLines(v)
    sb.toString
  }
}
