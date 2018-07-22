package org.gs.digraph

import scala.collection.mutable.ListBuffer

/** Network with capacity and flow
  *
  * @constructor creates a new FlowNetwork with a vertex count
  * @param v number of vertices
  * @see [[https://algs4.cs.princeton.edu/64maxflow/FlowNetwork.java.html]]
  * @author Scala translation by Gary Struthers from Java by Robert Sedgewick and Kevin Wayne.
  */
class FlowNetwork(val v: Int) {
  require(v >= 0, s"Number of vertices, v:$v must be nonnegative")
  private var _e = 0
  private val _adj = Array.fill[List[FlowEdge]](v)(List[FlowEdge]())

  def e(): Double = _e

  def addEdge(e: FlowEdge): Unit = {
    val _v = e.from
    val w = e.to

    def rangeGuard(x: Int): Boolean = x match {
      case x if 0 until v contains x => true
      case _ => false
    }

    require(rangeGuard(_v) && rangeGuard(w), s"verticies v:${_v} w:$w not in 0..$v ")

    _adj(_v) = e :: _adj(_v)
    _adj(w) = e :: _adj(w)
    _e += 1
  }

  def adj(v: Int): List[FlowEdge] = _adj(v)

  def edges(): Seq[FlowEdge] = for {
    vV <- 0 until v
    e <- adj(vV)
  } yield e


  override def toString(): String = {
    val lf = sys.props("line.separator")
    val sb = new StringBuilder()
    sb append (s"$v ${_e} $lf")

    def addLines(v: Int) {
      sb append (s"$v : ")
      adj(v) foreach (e => if(e.to != v) sb append (s"$e  "))
    }

    for(vV <- 0 until v) addLines(vV)
    sb.toString
  }
}
